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

  describe('addItems', () => {
    test('adds items to the list', () => {
      const presenter = new TestPresenter()
      const engine = new Engine(presenter)
      const model = engine.getModel()
      engine.start()

      const list = new ListOp()
      model.setOpTree({ list })

      list.reset()
      expect(model.data).toMatchObject({ list: { order: [], items: {}, opNames: {} } })

      const c1 = new CounterOp()
      const c2 = new CounterOp()
      list.addItems(ListOp.END, [c1, c2], true)

      let id1
      expect(() => id1 = list.getIdFor(c1)).not.toThrow()
      expect(id1).toBeDefined()
      let id2
      expect(() => id2 = list.getIdFor(c2)).not.toThrow()
      expect(id2).toBeDefined()

      expect(presenter.state).toMatchObject({ list: {
        order: [id1, id2],
        opNames: { [id1]: c1.getOpName(), [id2]: c2.getOpName() }
      }})
      expect(list.getNestedOps()).toEqual(expect.arrayContaining([c1, c2]))

      // Try to add items in the middle...
      const c3 = new CounterOp()
      const c4 = new CounterOp()
      list.addItems(1, [c3, c4], true)

      let id3
      expect(() => id3 = list.getIdFor(c3)).not.toThrow()
      expect(id3).toBeDefined()
      let id4
      expect(() => id4 = list.getIdFor(c4)).not.toThrow()
      expect(id4).toBeDefined()

      expect(presenter.state).toMatchObject({ list: {
        order: [id1, id3, id4, id2],
        opNames: { [id1]: c1.getOpName(), [id2]: c2.getOpName(), [id3]: c3.getOpName(), [id4]: c4.getOpName()}
      }})
      expect(list.getNestedOps()).toEqual(expect.arrayContaining([c1, c2, c3, c4]))
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
