// @ts-check
/** 
 * @typedef {Object} Vote 
 * @property {string} voterId
 * @property {string} votedAliasId
 */
/**
 * create a vote
 * @param {string} voterId `id` of the voter
 * @param {string} votedAliasId `aliasId` of the voter
 * @returns {Vote}
 */
function createVote(voterId, votedAliasId) {
  return { voterId, votedAliasId };
}
/**
 * create or update vote
 * @param {string} voterId `id` of the voter
 * @param {string} votedAliasId `aliasId` of the voter
 * @param {Vote[]} votes
 * @returns {Vote[]}
 */
function upsertVote(voterId, votedAliasId, votes) {
  const newVote = createVote(voterId, votedAliasId);
  const voteIndex = votes.findIndex(x => voterId === x.voterId);
  if (voteIndex > -1) {
    return votes.map(x => voterId === x.voterId ? newVote : x);
  } else {
    return [ ...votes, newVote ];
  }
}

module.exports = {
  createVote,
  upsertVote
}
