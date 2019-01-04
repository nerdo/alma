/* global jest, describe, expect, test */
import { TestEngine } from '../helpers/TestEngine'
import { Noop } from '../operators/Noop'
import { Counter } from '../operators/Counter'
import { Model } from './Model'
import { List } from '../operators/List'
import { UnmountedOperatorError } from './UnmountedOperatorError'

describe('Operator', () => {
  test('getModel', () => {
    const counter = new Counter()
    TestEngine.start({ counter })

    expect(counter.getModel()).toBeInstanceOf(Model)
  })

  describe('getModelData', () => {
    test('an unmounted operator', () => {
      const counter = new Counter()
      expect(() => counter.getModelData(['value'])).toThrowError(UnmountedOperatorError)
    })

    test('after resetting an operator that sets a defined value', () => {
      const counter = new Counter()
      TestEngine.start({ counter })

      expect(counter.getModelData(['value'])).toBeUndefined()

      counter.reset()

      expect(counter.getModelData(['value'])).toBe(0)
    })
  })

  describe('setModelData', () => {
    test('an unmounted operator', () => {
      const counter = new Counter()
      expect(() => counter.setModelData(['value'], 5)).toThrowError(UnmountedOperatorError)
    })

    test('setting valid model data', () => {
      const counter = new Counter()
      TestEngine.start({ counter })

      counter.setModelData(['value'], 5)

      expect(counter.getModelData(['value'])).toBe(5)
    })
  })

  describe('deleteModelData', () => {
    test('an unmounted operator', () => {
      const counter = new Counter()
      expect(() => counter.deleteModelData(['value'])).toThrowError(UnmountedOperatorError)
    })

    test('deleting existing model data', () => {
      const counter = new Counter()
      TestEngine.start({ counter })
      counter.reset()

      expect(counter.getModelData(['value'])).toBeDefined()

      counter.deleteModelData(['value'])

      const data = counter.getModelData([])
      expect(data).toBeDefined()
      expect(data).toBeInstanceOf(Object)
      expect(data.value).not.toBeDefined()
      expect(data).not.toMatchObject({ value: void 0 })
    })
  })

  describe('propose', () => {
    test('an unmounted operator', () => {
      const counter = new Counter()
      counter.propose = jest.fn(counter.propose)

      expect(() => counter.setValue(0)).toThrowError(UnmountedOperatorError)
      expect(counter.propose).toHaveBeenCalled()
    })
  })

  describe('pathBelongsToOp', () => {
    test('plain object path to op', () => {
      const counter = new Counter()
      TestEngine.start({ foo: { bar: { counter } } })

      expect(counter.pathBelongsToOp(['foo', 'bar', 'counter'])).toBe(true)
      expect(counter.pathBelongsToOp(['foo', 'bar', 'counter', 'anything'])).toBe(true)
      expect(counter.pathBelongsToOp(['foo', 'bar', 'anything'])).toBe(false)
    })

    describe('nested ops', () => {
      test('addNestedOp (implicit)', () => {
        let counter, foo
        const list = new List(
          foo = new List(
            counter = new Counter()
          ),
          new Counter()
        )
        TestEngine.start({ list })

        const fooId = list.getIdFor(foo)
        const counterId = foo.getIdFor(counter)
        expect(counter.pathBelongsToOp(['list', 'items', fooId, 'items', counterId])).toBe(true)
      })

      test('unmount', () => {
        let counter, foo
        const list = new List(
          foo = new List(
            counter = new Counter()
          ),
          new Counter()
        )

        TestEngine.start({ list })
        foo.unmount()

        const fooId = list.getIdFor(foo)
        const counterId = foo.getIdFor(counter)
        expect(counter.pathBelongsToOp(['list', 'items', fooId, 'items', counterId])).toBe(false)
      })

      test('removeNestedOp', () => {
        let counter, foo
        const list = new List(
          foo = new List(
            counter = new Counter()
          ),
          new Counter()
        )

        TestEngine.start({ list })
        foo.removeNestedOp(counter)

        const fooId = list.getIdFor(foo)
        const counterId = foo.getIdFor(counter)
        expect(counter.pathBelongsToOp(['list', 'items', fooId, 'items', counterId])).toBe(false)
      })
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

  describe('makeSelectors', () => {
    test('no selectors', () => {
      const noop = new Noop()
      let selectors1
      expect(() => { selectors1 = noop.makeSelectors() }).not.toThrow()
      expect(selectors1).toBeInstanceOf(Object)
      expect(Object.keys(selectors1).length).toBe(0)

      const selectors2 = noop.makeSelectors()
      expect(selectors1).toBe(selectors2)
    })

    test('some selectors', () => {
      // Note: In order to get the function to be named properly, we wrap the mocks with functions.
      const mockFoo = jest.fn()
      const mockBar = jest.fn()
      const foo = () => mockFoo()
      const bar = () => mockBar()

      const noop = new Noop()

      let selectors
      expect(() => { selectors = noop.makeSelectors(foo, bar) }).not.toThrow()
      expect(selectors).toBeInstanceOf(Object)

      // We should be getting an object memoized by the instance.
      let selectors2
      expect(() => { selectors2 = noop.makeSelectors('this', 'is', 'irrelevant') }).not.toThrow()
      expect(selectors).toBe(selectors2)

      const selectorNames = Object.keys(selectors)
      expect(selectorNames.length).toBe(2)
      expect(selectorNames).toEqual(expect.arrayContaining(['foo', 'bar']))

      expect(selectors.foo).toBeInstanceOf(Function)
      expect(selectors.bar).toBeInstanceOf(Function)

      expect(mockFoo).not.toHaveBeenCalled()
      expect(mockBar).not.toHaveBeenCalled()

      selectors.foo()
      expect(mockFoo).toHaveBeenCalled()

      selectors.bar()
      expect(mockBar).toHaveBeenCalled()
    })
  })

  describe('makeIntentions', () => {
    test('no intentions', () => {
      const noop = new Noop()

      let intentions1
      expect(() => { intentions1 = noop.makeIntentions() }).not.toThrow()
      expect(intentions1).toBeInstanceOf(Object)
      expect(Object.keys(intentions1).length).toBe(0)

      const intentions2 = noop.makeIntentions()
      expect(intentions1).toBe(intentions2)
    })

    test('some intentions', () => {
      // Note: In order to get the function to be named properly, we wrap the mocks with functions.
      const mockFoo = jest.fn()
      const mockBar = jest.fn()
      const foo = () => mockFoo()
      const bar = () => mockBar()

      const noop = new Noop()

      let intentions
      expect(() => { intentions = noop.makeIntentions(foo, bar) }).not.toThrow()
      expect(intentions).toBeInstanceOf(Object)

      // We should be getting an object memoized by the instance.
      let intentions2
      expect(() => { intentions2 = noop.makeIntentions('this', 'is', 'irrelevant') }).not.toThrow()
      expect(intentions).toBe(intentions2)

      const intentionNames = Object.keys(intentions)
      expect(intentionNames.length).toBe(2)
      expect(intentionNames).toEqual(expect.arrayContaining(['foo', 'bar']))

      expect(intentions.foo).toBeInstanceOf(Function)
      expect(intentions.bar).toBeInstanceOf(Function)

      expect(mockFoo).not.toHaveBeenCalled()
      expect(mockBar).not.toHaveBeenCalled()

      intentions.foo()
      expect(mockFoo).toHaveBeenCalled()

      intentions.bar()
      expect(mockBar).toHaveBeenCalled()
    })
  })
})
