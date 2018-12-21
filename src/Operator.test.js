/* global describe, expect, test */
import { TestEngine } from './helpers/TestEngine'
import { Counter } from './operators/Counter'
import { Operator } from './Operator'

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

  test('pathBelongsToOp', () => {
    const counter = new Counter()
    TestEngine.start({ foo: { bar: { counter } } })

    expect(counter.pathBelongsToOp(['foo', 'bar', 'counter'])).toBe(true)
    expect(counter.pathBelongsToOp(['foo', 'bar', 'counter', 'anything'])).toBe(true)
    expect(counter.pathBelongsToOp(['foo', 'bar', 'anything'])).toBe(false)
  })

  describe('getAbsoluteChange', () => {
    describe('undefined data', () => {
      test('at the top level', () => {
        const counter = new Counter()
        TestEngine.start({ counter })

        const change = counter.getAbsoluteChange(void 0)

        expect(change).toMatchObject({})
      })

      test('nested', () => {
        const counter = new Counter()
        TestEngine.start({ foo: { bar: { counter } } })

        const change = counter.getAbsoluteChange(void 0)

        expect(change).toMatchObject({ foo: { bar: {} } })
      })
    })

    describe('defined data', () => {
      test('at the top level', () => {
        const counter = new Counter()
        TestEngine.start({ counter })

        const change = counter.getAbsoluteChange('hello, world')

        expect(change).toMatchObject({ counter: 'hello, world' })
      })

      test('nested', () => {
        const counter = new Counter()
        TestEngine.start({ foo: { bar: { counter } } })

        const change = counter.getAbsoluteChange('hello, world')

        expect(change).toMatchObject({ foo: { bar: { counter: 'hello, world' } } })
      })
    })
  })
})
