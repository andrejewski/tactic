import test from 'ava'
import Defer from '../src/defer'

test('Defer should expose a Promise-compatible then method', t => {
  const defer = new Defer()
  const str = 'test'
  defer.then(x => t.is(x, str))
  defer.resolve(str)
})

test('Defer should expose a Promise-compatible catch method', t => {
  const defer = new Defer()
  const str = 'test'
  defer.catch(x => t.is(x, str))
  defer.reject(str)
})
