// @ts-check
/**
 * @template T
 * @typedef {Object} SuccessResponse
 * @property {T} data successful response data
 */
/**
 * @typedef {Object} FailedResponse
 * @property {string} error error message
 */
/**
 * @template T
 * @typedef {(data:FailedResponse | SuccessResponse<T>) => void} CallbackFn
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