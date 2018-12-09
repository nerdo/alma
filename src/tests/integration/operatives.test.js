/* global describe, test, expect */
import { Engine } from '../../Engine'
import { TestPresenter } from '../../adapters/TestPresenter'
import { CounterOperative } from './CounterOperative'
import { conformanceTests } from '../../interfaces/OperativeInterface.conformanceTests'

describe('operatives', () => {
  conformanceTests(
    {
      CounterOperative: () => new CounterOperative()
    },
    describe,
    test,
    expect
  )

  test('simple counter', () => {
    const presenter = new TestPresenter()
    const engine = new Engine(presenter)
    const counter = new CounterOperative()

    engine.getModel().setOpTree({ counter })
    engine.reset().start()

    expect(presenter.state.counter.value).toBe(0)

    counter.increment()
    expect(presenter.state.counter.value).toBe(1)

    counter.decrement()
    expect(presenter.state.counter.value).toBe(0)
  })
})
