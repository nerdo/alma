/* global describe, test, expect */
import { Counter } from './Counter'
import { operatorConformanceTests } from '../helpers/operatorConformanceTests'
import { TestEngine } from '../helpers/TestEngine'

describe('Counter', () => {
  operatorConformanceTests(
    {
      Counter: () => new Counter()
    },
    describe,
    test,
    expect
  )

  test('getSelectors', () => {
    const counter = new Counter()
    TestEngine.start({ counter })

    let selectors
    expect(() => { selectors = counter.getSelectors() }).not.toThrow()
    expect(selectors).toBeInstanceOf(Object)

    const selectorNames = Object.keys(selectors)
    expect(selectorNames.sort()).toEqual(['getValue'].sort())

    // Sanity check making sure the selectors are wired properly.
    counter.setValue(4)
    expect(selectors.getValue()).toBe(4)
  })

  test('getIntentions', () => {
    const counter = new Counter()
    TestEngine.start({ counter })

    let intentions
    expect(() => { intentions = counter.getIntentions() }).not.toThrow()
    expect(intentions).toBeInstanceOf(Object)

    const intentionNames = Object.keys(intentions)
    expect(intentionNames.sort()).toEqual([
      'setValue',
      'increment',
      'decrement'
    ].sort())

    // Sanity check making sure the intentions are wired properly.
    intentions.setValue(3)
    expect(counter.getValue()).toBe(3)
  })

  test('setValue', () => {
    const counter = new Counter()
    const engine = TestEngine.start({ counter })
    const presenter = engine.getPresenter()

    counter.setValue(5)

    expect(presenter.state.counter.value).toBe(5)
  })

  test('increment', () => {
    const counter = new Counter()
    const engine = TestEngine.start({ counter })
    const presenter = engine.getPresenter()

    counter.setValue(5)
    counter.increment()

    expect(presenter.state.counter.value).toBe(6)
  })

  test('decrement', () => {
    const counter = new Counter()
    const engine = TestEngine.start({ counter })
    const presenter = engine.getPresenter()

    counter.setValue(5)
    counter.decrement()

    expect(presenter.state.counter.value).toBe(4)
  })
})
