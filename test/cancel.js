import test from 'ava'
import _cancel from '../src/cancel'

const {
  Cancel,
  cancellable,
  isCancellable,
  CancelError,
  isCancelError
} = _cancel

test('Cancel.cancel() should reject with a CancelError', async t => {
  const cancel = new Cancel()
  cancel.cancel()
  const reason = await t.throws(cancel)
  t.is(isCancelError(reason), true)
})

test('Cancel.cancel() should return itself', async t => {
  const cancel = new Cancel()
  const reason = await t.throws(cancel.cancel())
  t.is(isCancelError(reason), true)
})

test('cancellable(promise) should wrap promise with a Cancel', t => {
  const promise = Promise.resolve(1)
  const cancel = cancellable(promise)
  t.is(isCancellable(cancel), true)
})

test('cancellable(promise) should preserve promise results', t => {
  const val = 1
  const resolved = Promise.resolve(val)
  const rejected = Promise.reject(val)

  cancellable(resolved).then(x => t.is(x, val))
  cancellable(rejected).catch(x => t.is(x, val))
})

test('isCancellable(x) should return whether x is a Cancel', t => {
  t.is(isCancellable(new Cancel()), true)
  t.is(isCancellable(null), false)
  t.is(isCancellable('test'), false)
})

test('isCancelError(x) should return whether x is a CancelError', t => {
  const error = new CancelError()
  t.is(isCancelError(error), true)
  t.is(isCancelError(null), false)
  t.is(isCancelError('test'), false)
})
