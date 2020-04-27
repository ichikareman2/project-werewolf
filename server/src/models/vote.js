// @ts-check
const {findUpdate} = require('../util');
/** 
 * @typedef {Object} Vote 
 * @property {string} voterAliasId
 * @property {string} votedAliasId
 */
/**
 * create a vote
 * @param {string} voterId `id` of the voter
 * @param {string} votedAliasId `aliasId` of the voter
 * @returns {Vote}
 */
function createVote(voterId, votedAliasId) {
  return { voterAliasId: voterId, votedAliasId };
}
/**
 * create or update vote
 * @param {string} voterAliasId `id` of the voter
 * @param {string} votedAliasId `aliasId` of the voter
 * @param {Vote[]} votes
 * @returns {Vote[]}
 */
function upsertVote(voterAliasId, votedAliasId, votes) {
  const newVote = createVote(voterAliasId, votedAliasId);
  const voteIndex = votes.findIndex(x => voterAliasId === x.voterAliasId);
  if (voteIndex > -1) {
    return findUpdate(
      v => v.voterAliasId === voterAliasId,
      () => newVote,
      votes
    );
  } else {
    return [ ...votes, newVote ];
  }
}
/** tally votes and get aliasId of voted out player
 * @param {Vote[]} votes 
 * @returns {string | undefined} aliasId
 */
function tallyVote(votes) {
  const majorityCount = Math.ceil(votes.length / 2);
  const tally = votes.reduce((acc, curr) => {
    const voted = acc.get(curr.votedAliasId);
    if (!voted) { acc.set(curr.votedAliasId, 1); }
    else { acc.set(curr.votedAliasId, voted + 1); }
    return acc;
  }, new Map());
  let votedOut = undefined;
  for (let [aliasId, count] of tally) {
    count >= majorityCount
      ? votedOut = aliasId
      : undefined;
  }
  return votedOut
}
module.exports = {
  createVote,
  upsertVote,
  tallyVote
}
