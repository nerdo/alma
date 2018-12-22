import { setupCustomMatchers } from '../helpers/jest'
import { OperatorInterface } from './OperatorInterface'

/**
 * Runs conformance tests on operator instances.
 * @param {Object.<string, Function>} instanceCreators - An object containing instance creators.
 *  Each key is a string identifying the operator, and the value is a function that returns an instance of the operator.
 * @param {Function} describe - jest describe function.
 * @param {Function} test - jest test function.
 * @param {Function} expect  - jest expect function.
 */
export function conformanceTests (instanceCreators, describe, test, expect) {
  setupCustomMatchers(expect)

  const table = Object.getOwnPropertyNames(instanceCreators)
    .map(name => [name, instanceCreators[name]])

  describe('OperatorInterface conformance of', () => {
    test.each(table)('%s', (name, newInstance) => {
      const op = newInstance()
      expect(op).toImplement(OperatorInterface)
    })
  })
}
