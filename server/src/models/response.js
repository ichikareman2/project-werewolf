// @ts-check
/**
 * @template T
 * @typedef {Object} SuccessResponse
 * @property {T} data
 */
/**
 * @typedef {Object} FailedResponse
 * @property {string} error
 */
/**
 * @template T
 * @param {T} [data] 
 * @returns {SuccessResponse<T>}
 */
function createSuccessResponse(data) {
  return {
    data
  }
}

/**
 * @param {string} error 
 * @returns {FailedResponse}
 */
function createFailedResponse(error) {
  return {
    error
  }
}
module.exports = {
  createSuccessResponse,
  createFailedResponse
}