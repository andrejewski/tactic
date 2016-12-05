function Timeout (milliseconds, message) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new TimeoutError(message))
    }, milliseconds)
  })
}

class TimeoutError extends Error {
  constructor (message) {
    super(message || `TimeoutError at ${(new Date()).toISOString()}`)
    // NOTE: we use this hack because subclassing Error does
    //  not allow instanceof TimeoutError to work under Babel
    this.__isTimeoutError = true
  }
}

function timeout (promise, milliseconds, message) {
  return Promise.race([promise, new Timeout(milliseconds, message)])
}

function isTimeoutError (error) {
  return error instanceof Error && error.__isTimeoutError
}

module.exports = {Timeout, TimeoutError, timeout, isTimeoutError}
