import { setupCustomMatchers } from './jest'
import { OperatorInterface } from '../interfaces/OperatorInterface'
import { Counter } from '../operators/Counter'
import { TestEngine } from './TestEngine'

/**
 * Runs conformance tests on operator instances.
 * @param {Object.<string, Function>} instanceCreators - An object containing instance creators.
 *  Each key is a string identifying the operator, and the value is a function that returns an instance of the operator.
 * @param {Function} describe - jest describe function.
 * @param {Function} test - jest test function.
 * @param {Function} expect  - jest expect function.
 */
export function operatorConformanceTests (instanceCreators, describe, test, expect) {
  setupCustomMatchers(expect)

  const table = Object.getOwnPropertyNames(instanceCreators)
    .map(name => [name, instanceCreators[name]])

  describe('OperatorInterface conformance of', () => {
    describe.each(table)('%s', (name, newInstance) => {
      test('implementing OperatorInterface', () => {
        const op = newInstance()
        expect(op).toImplement(OperatorInterface)
      })

      describe('mounting a nested op', () => {
        describe('before the parent op has been mounted', () => {
          test('on an undefined path', () => {
            const op = newInstance()
            const counter = new Counter()

            op.addNestedOp(counter, void 0)

            TestEngine.start({ op })

            // Mounting a nested op should result in it getting mounted in some subpath of the op.
            expect(counter.getPath().length).toBeGreaterThanOrEqual(1)
          })

          test('on an empty path', () => {
            const op = newInstance()
            const counter = new Counter()

            op.addNestedOp(counter, [])

            TestEngine.start({ op })

            // Mounting a nested op should result in it getting mounted in some subpath of the op.
            expect(counter.getPath().length).toBeGreaterThanOrEqual(1)
          })

          test('on a defined path', () => {
            const op = newInstance()
            const counter = new Counter()

            op.addNestedOp(counter, ['counter'])

            TestEngine.start({ op })

            // Mounting a nested op should result in it getting mounted in some subpath of the op.
            expect(counter.getPath().length).toBeGreaterThanOrEqual(1)
          })
        })

        describe('after the parent op has already been mounted', () => {
          test('on an undefined path', () => {
            const op = newInstance()
            const counter = new Counter()

            TestEngine.start({ op })

            op.addNestedOp(counter, void 0)

            // Mounting a nested op should result in it getting mounted in some subpath of the op.
            expect(counter.getPath().length).toBeGreaterThanOrEqual(1)
          })

          test('on an empty path', () => {
            const op = newInstance()
            const counter = new Counter()

            TestEngine.start({ op })

            op.addNestedOp(counter, [])

            // Mounting a nested op should result in it getting mounted in some subpath of the op.
            expect(counter.getPath().length).toBeGreaterThanOrEqual(1)
          })

          test('on a defined path', () => {
            const op = newInstance()
            const counter = new Counter()

            TestEngine.start({ op })

            op.addNestedOp(counter, ['counter'])

            // Mounting a nested op should result in it getting mounted in some subpath of the op.
            expect(counter.getPath().length).toBeGreaterThanOrEqual(1)
          })
        })
      })
    })
  })
}
