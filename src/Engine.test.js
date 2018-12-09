/* global describe, test, expect */
import { Engine } from './Engine'
import { TestPresenter } from './adapters/TestPresenter'

describe('Engine', () => {
  test('instantiation', () => {
    const result = new Engine()
    expect(result).toBeDefined()
  })

  test('wiring', () => {
    const presenter = new TestPresenter()
    const engine = new Engine(presenter)

    expect(presenter.state).toBeUndefined()

    engine.getModel().set(['foo', 'bar'], true)

    engine.start()

    expect(presenter.state).toEqual({ foo: { bar: true } })
  })
})
