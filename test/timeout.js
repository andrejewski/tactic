import test from 'ava'
import _timeout from '../src/timeout'

const {
  Timeout,
  timeout,
  TimeoutError,
  isTimeoutError
} = _timeout

test('Timeout(n) should reject after n milliseconds', async t => {
  const startTime = Date.now()
  const delta = 20
  const timeout = new Timeout(delta)
  const reason = await t.throws(timeout)
  const endTime = Date.now()
  t.is(isTimeoutError(reason), true)

  // we won't be exact because it makes the test flakey
  t.is(endTime >= (startTime + delta), true)
})

function wait (value, milliseconds) {
  return new Timeout(milliseconds).catch(() => value)
}

test('timeout(promise, n) should do nothing if promise resolves before n milliseconds', async t => {
  const val = 'test'
  const promise = wait(val, 5)
  const timer = timeout(promise, 10)
  t.is(await timer, val)
})

test('timeout(promise, n) should reject if promise does not resolve in n milliseconds', async t => {
  const val = 'test'
  const promise = wait(val, 10)
  const timer = timeout(promise, 5)
  const reason = await t.throws(timer)
  t.is(isTimeoutError(reason), true)
})

test('isTimeoutError(x) should return whether x is a TimeoutError', t => {
  const error = new TimeoutError()
  t.is(isTimeoutError(error), true)
  t.is(isTimeoutError(null), false)
  t.is(isTimeoutError('test'), false)
})
