const Defer = require('./defer')

class Cancel extends Defer {
  cancel (message) {
    this.reject(new CancelError(message))
    return this
  }
}

class CancelError extends Error {
  constructor (message) {
    super(message || `CancelError at ${(new Date()).toISOString()}`)
    // NOTE: we use this hack because subclassing Error does
    //  not allow instanceof CancelError to work under Babel
    this.__isCancelError = true
  }
}

function cancellable (promise) {
  const cancel = new Cancel()
  promise.then(cancel.resolve, cancel.reject)
  return cancel
}

function isCancelError (error) {
  return error instanceof Error && error.__isCancelError
}

function isCancellable (promise) {
  return promise instanceof Cancel
}

module.exports = {
  Cancel,
  cancellable,
  isCancellable,
  CancelError,
  isCancelError
}
