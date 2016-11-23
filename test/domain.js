import test from 'ava'
import _domain from '../src/domain'
import _cancel from '../src/cancel'

const {
  TakeDomain,
  DropDomain
} = _domain

const {
  Cancel,
  isCancelError
} = _cancel

test('TakeDomain.run(t) should cancel any existing cancellable', async t => {
  const first = new Cancel()
  const second = new Cancel()
  const domain = new TakeDomain()

  domain.run(() => first)
  domain.run(() => second)

  const reason = await t.throws(first)
  t.is(isCancelError(reason), true)
})

test('TakeDomain.add(c) should cancel any existing cancellable', async t => {
  const first = new Cancel()
  const second = new Cancel()
  const domain = new TakeDomain()

  domain.add(first)
  domain.add(second)

  const reason = await t.throws(first)
  t.is(isCancelError(reason), true)
})

test('DropDomain.run(t) should return a rejected Cancel if there is an existing cancellable', async t => {
  const first = new Cancel()
  const domain = new DropDomain()

  domain.run(() => first)
  const reject = domain.run(() => t.fail())
  const reason = await t.throws(reject)
  t.is(isCancelError(reason), true)
})

test('DropDomain.add(c) should cancel c if there is an existing cancellable', async t => {
  const first = new Cancel()
  const second = new Cancel()
  const domain = new DropDomain()

  domain.add(first)
  domain.add(second)

  const reason = await t.throws(second)
  t.is(isCancelError(reason), true)
})
