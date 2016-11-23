const Defer = require('./defer')
const {
  cancellable,
  isCancelError
} = require('./cancel')
const {
  timeout,
  isTimeoutError
} = require('./timeout')
const {
  TakeDomain,
  DropDomain
} = require('./domain')

module.exports = {
  Defer,

  cancellable,
  isCancelError,

  timeout,
  isTimeoutError,

  TakeDomain,
  DropDomain
}
