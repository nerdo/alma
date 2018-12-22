import { setupCustomMatchers } from '../helpers/jest'
import { OperatorInterface } from './OperatorInterface'

export function conformanceTests (instances, describe, test, expect) {
  setupCustomMatchers(expect)

  const table = Object.getOwnPropertyNames(instances)
    .map(name => [name, instances[name]])

  describe('OperatorInterface conformance of', () => {
    test.each(table)('%s', (name, newInstance) => {
      const op = newInstance()
      expect(op).toImplement(OperatorInterface)
    })
  })
}
