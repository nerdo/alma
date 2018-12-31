/* global describe, test, expect */
import { UnmountedOperatorError } from './UnmountedOperatorError'
import { Counter } from '../operators/Counter'

describe('UnmountedOperatorError', () => {
  test('something that is not an operator', () => {
    expect(() => new UnmountedOperatorError(void 0)).toThrow()
  })

  test('a valid operator', () => {
    const op = new Counter()
    let error
    expect(() => { error = new UnmountedOperatorError(op) }).not.toThrow()
    expect(error.toString()).toMatch(op.getOpName())
  })
})
