/* global describe, test, expect */
import { setupCustomMatchers } from '../helpers/jest'
import { OperativeInterface } from './OperativeInterface'

export function conformanceTests (instances, describe, test, expect) {
  setupCustomMatchers(expect)

  const table = Object.getOwnPropertyNames(instances)
    .map(name => [name, instances[name]])

  describe('OperativeInterface conformance of', () => {
    test.each(table)('%s', (name, newInstance) => {
      const op = newInstance()
      expect(op).toImplement(OperativeInterface)
    })
  })
}
