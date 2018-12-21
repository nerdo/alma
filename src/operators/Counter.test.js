/* global describe, test, expect */
import { Counter } from './Counter'
import { conformanceTests } from '../interfaces/OperatorInterface.conformanceTests'
import { TestEngine } from '../helpers/TestEngine'

describe('Counter', () => {
  conformanceTests(
    {
      Counter: () => new Counter()
    },
    describe,
    test,
    expect
  )

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
