/* global describe, expect, test */
import { Engine } from './Engine'
import { TestPresenter } from './adapters/TestPresenter'
import { CounterOperative, setValue } from './tests/integration/CounterOperative'

describe('AbstractOperative', () => {
  describe('getModelData', () => {
    test('getting default data', () => {
      const engine = new Engine(new TestPresenter())
      const counter = new CounterOperative()

      engine.getModel().setOpTree({ counter })
      engine.start()

      expect(counter.getModelData(['value'])).toBeUndefined()

      const result = counter.getModelData(['value'], setValue)

      expect(result).toBe(0)
    })
  })
})
