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
      expect(model.data).toMatchObject({ list: { order: [], items: {}, opNames: {} } })

      // TODO pass tag e.g. list.addItem(nested, 'CounterOp') and store it in the model data.
      // To unserialize, ListOp will need to be given a function that returns a new instance of the op.
      // TODO add another argument for index (ordering) so it can be added anywhere in the list.
      list.addItem(nested)
      nested.setValue()

      let nestedId
      expect(() => nestedId = list.getIdFor(nested)).not.toThrow()
      expect(nestedId).toBeDefined()

      expect(model.data).toMatchObject({ list: { order: [nestedId], opNames: {[nestedId]: nested.getOpName()} } })
      expect(list.getNestedOps()).toEqual(expect.arrayContaining([nested]))
    })
  })

  describe('moveItems', () => {
  })

  describe('deleteItems', () => {
  })

  describe('getItem', () => {
  })

  describe('getItems', () => {
  })

  describe('mounting a list from data', () => {
  })
})
