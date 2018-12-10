/* global describe, test, expect */
import { workLeafNodes } from './workLeafNodes'

describe('workLeafNodes', () => {
  test('an undefined tree', () => {
    const fn = jest.fn()

    workLeafNodes(void 0, fn)

    expect(fn).not.toHaveBeenCalled()
  })

  test('an empty tree', () => {
    const fn = jest.fn()

    workLeafNodes({}, fn)

    expect(fn).not.toHaveBeenCalled()
  })

  test('a flat tree', () => {
    const fn = jest.fn()

    workLeafNodes({a: 1, b: 2, c: 3}, fn)

    expect(fn).toHaveBeenCalledTimes(3)
  })

  test('a generic tree', () => {
    const fn = jest.fn()

    const NotPlainObject = class {
      constructor() {
        this.something = 1
        this.other = 2
        this.that = 3
        this.another = 4
      }
    }

    const tree = {
      a: 1, // yes
      b: false, // yes
      c: true, // yes
      foo: {
        x: 'hi', // yes
        [Symbol.for('something')]: () => true, // yes
        ok: false // yes
      },
      bar: {
        justice: {
          served: 3, // yes
          symbol: Symbol.for('something else') // yes
        },
        hello: {
          1: [0, 1, 2], // yes
          kitty: {} // yes
        }
      },
      d: 'hello', // yes
      notPlainObject: new NotPlainObject() // yes
    }

    workLeafNodes(tree, fn)

    expect(fn).toHaveBeenCalledTimes(11)

    // TODO check fn.mock.calls//?
  })

  test('custom isLeaf function', () => {
    const accepted = []
    const fn = jest.fn((...args) => accepted.push(args))

    const tree = {
      a: 1,
      b: {
        foo: true
      },
      c: 3
    }

    const isLeaf = function (path, node) {
      if (path.length === 0 || path[0] === 'a' || path[0] === 'b') {
        return false
      }
      return true
    }
    workLeafNodes(tree, fn, isLeaf)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(accepted).toMatchObject([
      [['c'], 3]
    ])
  })

  test('a leaf node as a tree', () => {
    const fn = jest.fn()

    const tree = 'not a tree'

    expect(() => workLeafNodes(tree, fn)).not.toThrow()

    fn.mock.calls//?
    expect(fn).not.toHaveBeenCalled()
  })
})
