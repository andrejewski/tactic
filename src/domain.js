const {Cancel} = require('./cancel')

class TakeDomain {
  run (task, message) {
    let promise = task()
    this.add(promise, message)
    return promise
  }

  add (cancellable, message) {
    if (this.cancellable) {
      this.cancellable.cancel(message)
    }
    this.cancellable = cancellable
  }
}

class DropDomain {
  run (task, message) {
    if (this.cancellable) {
      return (new Cancel()).cancel(message)
    }
    let promise = task()
    this.add(promise, message)
    return promise
  }

  add (cancellable, message) {
    if (this.cancellable) {
      cancellable.cancel(message)
      return
    }
    this.cancellable = cancellable
  }
}

module.exports = {TakeDomain, DropDomain}
