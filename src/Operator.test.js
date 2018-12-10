/* global describe, expect, test */
import { Engine } from './Engine'
import { TestPresenter } from './adapters/TestPresenter'
import { Counter, setValue } from './tests/integration/Counter'
import { Operator } from './Operator';

describe('Operator', () => {
  describe('getModelData', () => {
    test('getting default data', () => {
      const engine = new Engine(new TestPresenter())
      const counter = new Counter()

      expect(counter).toBeInstanceOf(Operator)

      engine.getModel().setOpTree({ counter })
      engine.start()

      expect(counter.getModelData(['value'])).toBeUndefined()

      const result = counter.getModelData(['value'], setValue)

      expect(result).toBe(0)
    })
  })

  describe('pathBelongsToOp', () => {
    const engine = new Engine(new TestPresenter())
    const counter = new Counter()

    expect(counter).toBeInstanceOf(Operator)

    engine.getModel().setOpTree({ foo: { bar: { counter } } })
    engine.start()

    expect(counter.pathBelongsToOp(['foo', 'bar', 'counter'])).toBe(true)
    expect(counter.pathBelongsToOp(['foo', 'bar', 'counter', 'anything'])).toBe(true)
    expect(counter.pathBelongsToOp(['foo', 'bar', 'anything'])).toBe(false)
  })
})
