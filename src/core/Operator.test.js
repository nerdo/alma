/* global describe, expect, test */
import { TestEngine } from '../helpers/TestEngine'
import { Counter } from '../operators/Counter'
import { Model } from './Model'
import { List } from '../operators/List'

describe('Operator', () => {
  test('getModel', () => {
    const counter = new Counter()
    TestEngine.start({ counter })

    expect(counter.getModel()).toBeInstanceOf(Model)
  })

  test('getModelData', () => {
    const counter = new Counter()
    TestEngine.start({ counter })

    expect(counter.getModelData(['value'])).toBeUndefined()

    counter.reset()

    expect(counter.getModelData(['value'])).toBe(0)
  })

  test('setModelData', () => {
    const counter = new Counter()
    TestEngine.start({ counter })

    counter.setModelData(['value'], 5)

    expect(counter.getModelData(['value'])).toBe(5)
  })

  describe('pathBelongsToOp', () => {
    test('plain object path to op', () => {
      const counter = new Counter()
      TestEngine.start({ foo: { bar: { counter } } })

      expect(counter.pathBelongsToOp(['foo', 'bar', 'counter'])).toBe(true)
      expect(counter.pathBelongsToOp(['foo', 'bar', 'counter', 'anything'])).toBe(true)
      expect(counter.pathBelongsToOp(['foo', 'bar', 'anything'])).toBe(false)
    })

    test('nested ops', () => {
      let counter, foo
      const list = new List(
        foo = new List(
          counter = new Counter()
        )
      )
      TestEngine.start({ list })

      expect(counter.pathBelongsToOp(['list', 'items', list.getIdFor(foo), 'items', foo.getIdFor(counter)])).toBe(true)
    })
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

  describe('getRelativeSlice', () => {
    test('a value on an object path that exists', () => {
      const counter = new Counter()
      TestEngine.start({ counter })
      const data = {
        counter: {
          value: 1
        }
      }
      const slice = counter.getRelativeSlice(data)

      expect(slice).toMatchObject({ value: 1 })
    })

    test('a value on an object path that does not exist (shallow)', () => {
      const counter = new Counter()
      TestEngine.start({ counter })
      const data = {
        foo: {}
      }

      const slice = counter.getRelativeSlice(data)

      expect(slice).toBeUndefined()
    })

    test('a value on an object path that does not exist (deep)', () => {
      const counter = new Counter()
      TestEngine.start({ foo: { bar: { counter } } })
      const data = {
        foo: {
          bar: {
            counter: {
              value: 5
            }
          }
        }
      }

      const slice = counter.getRelativeSlice(data)

      expect(slice).toMatchObject({ value: 5 })
    })
  })
})