/* global describe, test, expect */
import { Noop } from './Noop'
import { operatorConformanceTests } from '../helpers/operatorConformanceTests'

describe('Noop', () => {
  operatorConformanceTests(
    {
      Noop: () => new Noop()
    },
    describe,
    test,
    expect
  )

  test('getOpName', () => {
    const noop = new Noop()
    expect(noop.getOpName()).toBe('Noop')
  })
})
