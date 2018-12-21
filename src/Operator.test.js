/* global describe, expect, test */
import { TestEngine } from './helpers/TestEngine'
import { Counter } from './operators/Counter'

describe('Operator', () => {
  describe('getModelData', () => {
    test('getting default data', () => {
      const counter = new Counter()
      TestEngine.start({ counter })

      expect(counter.getModelData(['value'])).toBeUndefined()

      counter.reset()

      expect(counter.getModelData(['value'])).toBe(0)
    })
  })

  describe('pathBelongsToOp', () => {
    const counter = new Counter()
    TestEngine.start({ foo: { bar: { counter } } })

    expect(counter.pathBelongsToOp(['foo', 'bar', 'counter'])).toBe(true)
    expect(counter.pathBelongsToOp(['foo', 'bar', 'counter', 'anything'])).toBe(true)
    expect(counter.pathBelongsToOp(['foo', 'bar', 'anything'])).toBe(false)
  })
})
