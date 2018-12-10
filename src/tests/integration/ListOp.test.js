/* global describe, test, expect */
import { conformanceTests } from '../../interfaces/OperatorInterface.conformanceTests'
import { Engine } from '../../Engine'
import { TestPresenter } from '../../adapters/TestPresenter'
import { ListOp } from './ListOp'
import { CounterOp } from './CounterOp'

describe('ListOp', () => {
  conformanceTests(
    {
      ListOp: () => new ListOp()
    },
    describe,
    test,
    expect
  )

  describe('addItem', () => {
    test('adds an item to the list', () => {
      const engine = new Engine(new TestPresenter())
      const model = engine.getModel()
      engine.start()

      const list = new ListOp()
      const nested = new CounterOp()
      model.setOpTree({ list })

      list.reset()
      expect(model.data).toMatchObject({ list: { order: [], items: {} } })

      list.addItem(nested)
      nested.setValue()

      let nestedId
      expect(() => nestedId = list.getIdFor(nested)).not.toThrow()
      expect(nestedId).toBeDefined()

      expect(model.data).toMatchObject({ list: { order: [nestedId] } })
      expect(list.getNestedOps()).toEqual(expect.arrayContaining([nested]))
    })
  })
})
