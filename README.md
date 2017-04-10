# Tactic

[![Greenkeeper badge](https://badges.greenkeeper.io/andrejewski/tactic.svg)](https://greenkeeper.io/)
Promise utilities for just the worst people

Tactic is a library of Promise primitives we have written ourselves plenty of times, but this is the last time we reinvent the wheel.
Tactic is Promise library independent.

```sh
npm install tactic
```

## What's in the box!?
Tactic includes these Promise abstractions/helpers:

- Defer
- Cancel, a defer with a `cancel()` method
- Timeout, a promise using `setTimeout()`
- Domain

Domain is one I made up, but it captures an ad-hoc pattern I see very frequently.

### Defer
Defers are sometimes labeled an anti-pattern but they are pretty useful when it comes down to building something and much more flexible than Promises (which is the main concern).

Defers are just Promises that you can resolve and reject outside of the scope of the function usually passed to the Promise constructor. Check out `src/defer.js`, it really is that simple.

```js
// Defers are great with async/await
// Here we don't need to check if we are connected
const database = null // your db
const Defer = require('tactic').Defer
const dbConnected = new Defer()

database.connect(error => {
  error ? dbConnected.reject(error) : dbConnected.resolve()
})

async function query (id) {
  // Just await being connected
  // If we are already we go straight to querying
  await dbConnected
  database.query(id)
}

query('yo mama')
```

### Cancel
Cancel really is only included to stop bike shedding. Here we say a cancellation is a rejection with a `CancelError`, which can be checked with `isCancelError(reason)`. Those are the rules. I didn't make them. I just thought them up and wrote them down.

Any promise can be wrapped with a Cancel using the `cancellable(promise)` function and then be cancelled by calling `cancel()` on the result.

```js
const {
  cancellable,
  isCancelError
} = require('tactic')
const assert = require('assert')
const fetch = null // whatever you use for api calls

const apiCall = cancellable(fetch('/api/my-whatever'))

// somewhere before it resolves
apiCall.cancel()

apiCall.catch(reason => {
  assert(isCancelError(reason))
})
```

### Timeout
Again, anyone could write a Timeout promise. The problem is we all have. Here we say a timeout is a rejection with a `TimeoutError`, which can be checked with `isTimeoutError(x)`. (Consistency!)

Any promise can be wrapped in a Timeout using the `timeout(promise, milliseconds)` function.

```js
const {
  timeout,
  isTimeoutError
} = require('tactic')
const assert = require('assert')
const fetch = null // whatever you use for api calls

const threeSeconds = 3000
const apiCall = timeout(fetch('/api/my-whatever'), threeSeconds)

// if the api call does not resolve in 3 seconds
apiCall.catch(reason => {
  assert(isTimeoutError(reason))
})
```

### Domain
Okay, so this is new. A domain is just a slot where only one promise can be run at a given time to prevent race conditions and clobbering. The poster child for this problem is real-time search, that instant results-as-you-type deal. As someone is typing they fire off "cow" and then "coward", each with an network call. In the case where "coward" resolves first (latency or just less results so faster), the "cow" result will overwrite its results when it returns.

Domains solve this by cancelling promises that happen at the same time, leaving all but one. And there are two Domain variants: `TakeDomain` and `DropDomain`. With TakeDomain the newest promise takes the slot from any other promise already running, and that old promise is cancelled ("coward" wins). With DropDomain the newest promise, if there is another already in the domain, is dropped i.e. cancelled ("cow" wins).

Both domains accept competing promises via `run()` which accepts a function which returns a Cancel. Note that you must pass a Cancel, so any plain Promise needs to be wrapped with `cancellable(promise)` (no magic casting here).

```js
const {
  cancellable,
  DropDomain
} = require('tactic')
const fetch = null // whatever you use for api calls

const domain = new DropDomain()
const result = domain.run(function firstCall () {
  const apiCall = fetch('/api/my-search')
  return cancellable(apiCall)
})

// if firstCall has not completed
// secondCall won't ever be called
const promise = domain.run(function secondCall () {
  const apiCall = fetch('/api/my-search')
  return cancellable(apiCall)
})

// firstCall will resolve with whatever in result
// promise will have rejected with a CancelError
```

### Recap
Here are all the things Tactic exposes:

- `class Defer`
  - `.resolve()`
  - `.reject()`
  - `.then()`, `.catch()`, and `.finally()` (if your base Promise supports it)
- `cancellable(promise) Cancel`
  - `.cancel([message])`
- `isCancelError(any) boolean`
- `timeout(promise, milliseconds[, message])`
- `isTimeoutError(any) boolean`
- `class TakeDomain`
- `class DropDomain`

The `[message]` bits are for optionally setting the error message.

Note: you can access the classes Cancel, CancelError, Timeout, and TimeoutError directly from their respective `tactic/lib/{cancel|timeout}` modules. But you shouldn't so I make you feel bad about it.

## Contributing
Contributions are incredibly welcome as long as they are standardly applicable and pass the tests (or break bad ones). Tests are written in AVA.

```bash
# running tests
npm run test
```

Follow me on [Twitter](https://twitter.com/compooter) for updates or just for the lolz and please check out my other [repositories](https://github.com/andrejewski) if I have earned it. I thank you for reading.
