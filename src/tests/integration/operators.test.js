/* global describe, test, expect */
import { Engine } from '../../Engine'
import { TestPresenter } from '../../adapters/TestPresenter'
import { CounterOp } from './CounterOp'
import { conformanceTests } from '../../interfaces/OperatorInterface.conformanceTests'

describe('operators', () => {
  conformanceTests(
    {
      CounterOp: () => new CounterOp()
    },
    describe,
    test,
    expect
  )

  test('simple counter', () => {
    const presenter = new TestPresenter()
    const engine = new Engine(presenter)
    const counter = new CounterOp()

    engine.getModel().setOpTree({ counter })
    engine.reset().start()

    expect(presenter.state.counter.value).toBe(0)

    counter.increment()
    expect(presenter.state.counter.value).toBe(1)

    counter.decrement()
    expect(presenter.state.counter.value).toBe(0)
  })
})
