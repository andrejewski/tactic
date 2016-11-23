class Defer {
  constructor () {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  then (...args) {
    return this.promise.then(...args)
  }

  catch (...args) {
    return this.promise.catch(...args)
  }

  finally (...args) {
    // NOTE: basic Promises don't have this yet
    return this.promise.finally(...args)
  }
}

module.exports = Defer
