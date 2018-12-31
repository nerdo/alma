/* global describe, test, expect */
import { operatorConformanceTests } from '../helpers/operatorConformanceTests'
import { List } from './List'
import { Counter } from './Counter'
import { TestEngine } from '../helpers/TestEngine'

describe('List', () => {
  operatorConformanceTests(
    {
      List: () => new List()
    },
    describe,
    test,
    expect
  )

  describe('creating a new list', () => {
    test('passing ops into the constructor', () => {
      let c1, c2, c3
      const list = new List(
        c1 = new Counter(),
        c2 = new Counter(),
        c3 = new Counter()
      )

      const engine = TestEngine.start({ list })
      const presenter = engine.getPresenter()

      expect(list.getNestedOps().length).toBe(3)

      list.reset()

      const id1 = list.getIdFor(c1)
      expect(id1).toBeDefined()

      const id2 = list.getIdFor(c2)
      expect(id2).toBeDefined()

      const id3 = list.getIdFor(c3)
      expect(id3).toBeDefined()

      expect(presenter.state).toMatchObject({ list: { order: [id1, id2, id3] } })
      expect(Object.keys(presenter.state.list.items).length).toBe(3)
    })

    test('passing nested ops into the constructor', () => {
      let c1, c2, c3, nestedList
      const list = new List(
        c1 = new Counter(),
        c2 = new Counter(),
        nestedList = new List(
          c3 = new Counter()
        )
      )

      const engine = TestEngine.start({ list })
      const presenter = engine.getPresenter()

      list.reset()

      const id1 = list.getIdFor(c1)
      expect(id1).toBeDefined()

      const id2 = list.getIdFor(c2)
      expect(id2).toBeDefined()

      const nestedListId = list.getIdFor(nestedList)
      expect(nestedListId).toBeDefined()

      const id3 = nestedList.getIdFor(c3)
      expect(id3).toBeDefined()

      expect(presenter.state).toMatchObject({ list: { order: [id1, id2, nestedListId] } })
      expect(Object.keys(presenter.state.list.items).length).toBe(3)

      expect(presenter.state.list.items[nestedListId]).toMatchObject({ order: [id3] })
      expect(Object.keys(presenter.state.list.items[nestedListId].items).length).toBe(1)
    })

    test('adding items after construction is the same as passing ops into the constructor', () => {
      let l1c1, l1c2, l1c3
      const list1 = new List(
        l1c1 = new Counter(),
        l1c2 = new Counter(),
        l1c3 = new Counter()
      )

      const engine1 = TestEngine.start({ list: list1 })
      const presenter1 = engine1.getPresenter()

      list1.reset()

      const l1id1 = list1.getIdFor(l1c1)
      expect(l1id1).toBeDefined()

      const l1id2 = list1.getIdFor(l1c2)
      expect(l1id2).toBeDefined()

      const l1id3 = list1.getIdFor(l1c3)
      expect(l1id3).toBeDefined()

      expect(presenter1.state).toMatchObject({ list: { order: [l1id1, l1id2, l1id3] } })
      expect(Object.keys(presenter1.state.list.items).length).toBe(3)

      const l2c1 = new Counter()
      const l2c2 = new Counter()
      const l2c3 = new Counter()
      const list2 = new List()

      const engine2 = TestEngine.start({ list: list2 })
      const presenter2 = engine2.getPresenter()

      list2.reset()
      list2.addItems(List.END, [l2c1, l2c2, l2c3], true)

      const l2id1 = list2.getIdFor(l2c1)
      expect(l2id1).toBeDefined()

      const l2id2 = list2.getIdFor(l2c2)
      expect(l2id2).toBeDefined()

      const l2id3 = list2.getIdFor(l2c3)
      expect(l2id3).toBeDefined()

      expect(presenter2.state).toMatchObject({ list: { order: [l2id1, l2id2, l2id3] } })
      expect(Object.keys(presenter2.state.list.items).length).toBe(3)

      expect(l1id1).toBe(l2id1)
      expect(l1id2).toBe(l2id2)
      expect(l1id3).toBe(l2id3)
    })
  })

  describe('addItems', () => {
    test('adding items to a new list', () => {
      const list = new List()
      const engine = TestEngine.start({ list })
      const presenter = engine.getPresenter()
      const model = engine.getModel()

      list.reset()
      expect(model.data).toMatchObject({ list: { order: [], items: {}, opNames: {} } })

      const c1 = new Counter()
      const c2 = new Counter()
      list.addItems(List.END, [c1, c2], true)

      let id1
      expect(() => { id1 = list.getIdFor(c1) }).not.toThrow()
      expect(id1).toBeDefined()
      let id2
      expect(() => { id2 = list.getIdFor(c2) }).not.toThrow()
      expect(id2).toBeDefined()

      expect(presenter.state).toMatchObject({ list: {
        order: [id1, id2],
        opNames: { [id1]: c1.getOpName(), [id2]: c2.getOpName() }
      } })
      expect(list.getNestedOps()).toEqual(expect.arrayContaining([c1, c2]))

      // Try to add items in the middle...
      const c3 = new Counter()
      const c4 = new Counter()
      list.addItems(1, [c3, c4], true)

      let id3
      expect(() => { id3 = list.getIdFor(c3) }).not.toThrow()
      expect(id3).toBeDefined()
      let id4
      expect(() => { id4 = list.getIdFor(c4) }).not.toThrow()
      expect(id4).toBeDefined()

      expect(presenter.state).toMatchObject({ list: {
        order: [id1, id3, id4, id2],
        opNames: { [id1]: c1.getOpName(), [id2]: c2.getOpName(), [id3]: c3.getOpName(), [id4]: c4.getOpName() }
      } })
      expect(list.getNestedOps()).toEqual(expect.arrayContaining([c1, c2, c3, c4]))

      const c5 = new Counter()
      list.addItems(List.END, [c5], true)

      let id5
      expect(() => { id5 = list.getIdFor(c5) }).not.toThrow()
      expect(id5).toBeDefined()

      expect(presenter.state).toMatchObject({ list: {
        order: [id1, id3, id4, id2, id5],
        opNames: { [id1]: c1.getOpName(), [id2]: c2.getOpName(), [id3]: c3.getOpName(), [id4]: c4.getOpName(), [id5]: c5.getOpName() }
      } })
      expect(list.getNestedOps()).toEqual(expect.arrayContaining([c1, c2, c3, c4, c5]))

      const c6 = new Counter()
      list.addItems(-1, [c6], true)

      let id6
      expect(() => { id6 = list.getIdFor(c6) }).not.toThrow()
      expect(id6).toBeDefined()

      expect(presenter.state).toMatchObject({ list: {
        order: [id6, id1, id3, id4, id2, id5],
        opNames: { [id1]: c1.getOpName(), [id2]: c2.getOpName(), [id3]: c3.getOpName(), [id4]: c4.getOpName(), [id6]: c6.getOpName(), [id6]: c6.getOpName() }
      } })
      expect(list.getNestedOps()).toEqual(expect.arrayContaining([c1, c2, c3, c4, c5, c6]))
    })

    test('adding items to an existing list', () => {
      const data = {
        'list': {
          'order': [
            1,
            4,
            3,
            2,
            5
          ]
        }
      }
      const list = new List()
      const c = new Counter()

      TestEngine.start({ list }, data)

      list.addItems(List.END, [c])

      const id = list.getIdFor(c)

      expect(id).toBe(6)
    })
  })

  describe('moveItems', () => {
    test('moving a single item', () => {
      const list = new List()
      const c1 = new Counter()
      const c2 = new Counter()
      const c3 = new Counter()
      const c4 = new Counter()
      const c5 = new Counter()

      const engine = TestEngine.start({ list })
      const presenter = engine.getPresenter()

      list.reset()
      list.addItems(List.END, [c1, c2, c3, c4, c5], true)

      const originalItems = presenter.state.list.items

      const id1 = list.getIdFor(c1)
      const id2 = list.getIdFor(c2)
      const id3 = list.getIdFor(c3)
      const id4 = list.getIdFor(c4)
      const id5 = list.getIdFor(c5)

      expect(presenter.state).toMatchObject({ list: { order: [id1, id2, id3, id4, id5], items: originalItems } })

      list.moveItems([c3], 0)
      expect(presenter.state).toMatchObject({ list: { order: [id3, id1, id2, id4, id5] } })

      list.moveItems([c3, c2, c5], List.END)
      expect(presenter.state).toMatchObject({ list: { order: [id1, id4, id3, id2, id5] } })
    })
  })

  test('deleteItems', () => {
    let c1, c2, c3, c4, c5
    const list = new List(
      c1 = new Counter(),
      c2 = new Counter(),
      c3 = new Counter(),
      c4 = new Counter(),
      c5 = new Counter()
    )

    const engine = TestEngine.start({ list })
    const presenter = engine.getPresenter()

    list.reset()
    list.deleteItems([c1, c4])

    const id1 = list.getIdFor(c1)
    const id2 = list.getIdFor(c2)
    const id3 = list.getIdFor(c3)
    const id4 = list.getIdFor(c4)
    const id5 = list.getIdFor(c5)

    expect(() => c1.increment()).toThrow()
    expect(() => c4.increment()).toThrow()
    expect(presenter.state.list.order).not.toContainEqual(id1)
    expect(presenter.state.list.order).not.toContainEqual(id4)
    expect(Object.keys(list.getOpNames())).not.toContainEqual(`${id1}`)
    expect(Object.keys(list.getOpNames())).not.toContainEqual(`${id4}`)
    expect(presenter.state.list.items[id1]).toBeUndefined()
    expect(presenter.state.list.items[id4]).toBeUndefined()
    expect(presenter.state.list.items[id2]).toBeDefined()
    expect(presenter.state.list.items[id3]).toBeDefined()
    expect(presenter.state.list.items[id5]).toBeDefined()
    expect(presenter.state).toMatchObject({ list: { order: [id2, id3, id5] } })
  })

  test('clear', () => {
    let c1, c2, c3, nestedList
    const list = new List(
      c1 = new Counter(),
      c2 = new Counter(),
      nestedList = new List(
        c3 = new Counter()
      )
    )

    const engine = TestEngine.start({ list })
    const presenter = engine.getPresenter()

    list.reset()

    const id1 = list.getIdFor(c1)
    expect(id1).toBeDefined()

    const id2 = list.getIdFor(c2)
    expect(id2).toBeDefined()

    const nestedListId = list.getIdFor(nestedList)
    expect(nestedListId).toBeDefined()

    const id3 = nestedList.getIdFor(c3)
    expect(id3).toBeDefined()

    expect(presenter.state).toMatchObject({ list: { order: [id1, id2, nestedListId] } })
    expect(presenter.state.list.items).toBeDefined()
    expect(Object.keys(presenter.state.list.items).length).toBe(3)

    list.clear()

    expect(() => c1.increment()).toThrow()
    expect(() => c2.increment()).toThrow()
    expect(() => nestedList.addItems(List.END, []))
    expect(() => c3.increment()).toThrow()
    expect(presenter.state.list.items).toBeDefined()
    expect(Object.keys(presenter.state.list.items).length).toBe(0)
  })

  describe('getOpById', () => {
    test('getting an operator by id', () => {
      let c1, c2
      const list = new List(
        c1 = new Counter(),
        c2 = new Counter()
      )

      TestEngine.start({ list })

      const id1 = list.getIdFor(c1)
      expect(id1).toBeDefined()

      const id2 = list.getIdFor(c2)
      expect(id2).toBeDefined()

      const result = list.getOpById(id1)
      expect(result).toBe(c1)
    })
  })

  describe('getOps', () => {
    test('getting all operators within a list', () => {
      let c1, c2
      const list = new List(
        c1 = new Counter(),
        c2 = new Counter()
      )

      TestEngine.start({ list })

      const result = list.getOps()

      expect(result).toEqual([c1, c2])
    })
  })

  describe('mounting a list with existing data', () => {
    test('mounting', () => {
      const data = {
        list:
        {
          items:
          {
            '1': { value: 1 },
            '2': { value: -1 },
            '3':
            {
              items: { '1': { value: 5 } },
              opNames: { '1': 'Counter' },
              order: [1]
            }
          },
          opNames: { '1': 'Counter', '2': 'Counter', '3': 'List' },
          order: [1, 2, 3]
        }
      }

      let c1, c2, c3, nestedList
      const list = new List()
      list.setOpCreators({
        Counter: () => new Counter(),
        List: () => (new List()).setOpCreators(list.getOpCreators())
      })

      TestEngine.start({ list }, data)

      c1 = list.getOpById(1)
      expect(c1).toBeInstanceOf(Counter)

      c2 = list.getOpById(2)
      expect(c2).toBeInstanceOf(Counter)

      nestedList = list.getOpById(3)
      expect(nestedList).toBeInstanceOf(List)

      c3 = nestedList.getOpById(1)
      expect(c3).toBeInstanceOf(Counter)

      expect(c1.getValue()).toBe(1)
      expect(c2.getValue()).toBe(-1)
      expect(c3.getValue()).toBe(5)

      expect(() => { c3.increment() }).not.toThrow()
      expect(c3.getValue()).toBe(6)
    })
  })
})
