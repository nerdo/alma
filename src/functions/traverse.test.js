/* global jest, describe, test, expect */
import { traverse, defaultGetChildren } from './traverse'

describe('traverse', () => {
  test('an undefined tree', () => {
    const fn = jest.fn()

    traverse(void 0, fn)

    expect(fn).not.toHaveBeenCalled()
  })

  test('a null tree', () => {
    const fn = jest.fn()

    traverse(null, fn)

    expect(fn).not.toHaveBeenCalled()
  })

  test('an empty tree', () => {
    const nodes = []
    const paths = []
    const fn = jest.fn((node, path) => {
      nodes.push(node)
      paths.push(path)
    })

    traverse({}, fn)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(paths).toContainEqual([])
  })

  test('a scalar value', () => {
    const nodes = []
    const paths = []
    const fn = jest.fn((node, path) => {
      nodes.push(node)
      paths.push(path)
    })
    const tree = true

    traverse(tree, fn)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(nodes.length).toBe(1)
    expect(paths.length).toBe(1)
    expect(paths).toContainEqual([])
  })

  test('a shallow tree', () => {
    const nodes = []
    const paths = []
    const fn = jest.fn((node, path) => {
      nodes.push(node)
      paths.push(path)
    })
    const tree = {
      foo: 1,
      bar: 2,
      what: 3
    }

    traverse(tree, fn)

    expect(fn).toHaveBeenCalledTimes(4)
    expect(nodes.length).toBe(4)
    expect(paths.length).toBe(4)
    expect(paths).toContainEqual([])
    expect(paths).toContainEqual(['foo'])
    expect(paths).toContainEqual(['bar'])
    expect(paths).toContainEqual(['what'])
  })

  describe('a tree with multiple levels', () => {
    test('root to leaf order', () => {
      const nodes = []
      const paths = []
      const levels = {}
      const levelOrder = []
      const fn = jest.fn((node, path) => {
        nodes.push(node)
        paths.push(path)

        const level = path.length
        if (!levels[level]) {
          levels[level] = true
          levelOrder.push(level)
        }
      })
      const tree = {
        a: 1,
        b: {
          foo: true
        },
        c: {
          nested: {
            nice: true,
            enabled: false
          }
        }
      }

      traverse(tree, fn)

      expect(fn).toHaveBeenCalledTimes(8)
      expect(nodes.length).toBe(8)
      expect(paths.length).toBe(8)
      expect(paths).toContainEqual([])
      expect(paths).toContainEqual(['a'])
      expect(paths).toContainEqual(['b'])
      expect(paths).toContainEqual(['c'])
      expect(paths).toContainEqual(['b', 'foo'])
      expect(paths).toContainEqual(['c', 'nested'])
      expect(paths).toContainEqual(['c', 'nested', 'nice'])
      expect(paths).toContainEqual(['c', 'nested', 'enabled'])

      // Traversal order. Since iterating an object has no defined order, the best we can do is make sure that
      // the tree depths (levels) are traversed in the order we expect...
      expect(levelOrder).toEqual([0, 1, 2, 3])
    })
  })

  test('a custom getChildren function', () => {
    const nodes = []
    const paths = []
    const fn = jest.fn((node, path) => {
      nodes.push(node)
      paths.push(path)
    })
    const Container = class {
      constructor () {
        this[Symbol.for('nested')] = [
          { something: true },
          { else: false }
        ]
      }
      getNested () {
        return this[Symbol.for('nested')]
      }
    }
    const tree = {
      a: 1,
      b: {
        foo: true
      },
      c: new Container()
    }

    traverse(
      tree,
      fn,
      (node, path) => {
        return defaultGetChildren(node, path)
          .concat(
            node instanceof Container
              ? [{ path: path.concat('nested'), node: node.getNested() }]
              : []
          )
      }
    )

    expect(fn).toHaveBeenCalledTimes(10)
    expect(nodes.length).toBe(10)
    expect(paths.length).toBe(10)
    expect(paths).toContainEqual([])
    expect(paths).toContainEqual(['a'])
    expect(paths).toContainEqual(['b'])
    expect(paths).toContainEqual(['c'])
    expect(paths).toContainEqual(['b', 'foo'])
    expect(paths).toContainEqual(['c', 'nested'])
    expect(paths).toContainEqual(['c', 'nested', '0'])
    expect(paths).toContainEqual(['c', 'nested', '1'])
    expect(paths).toContainEqual(['c', 'nested', '0', 'something'])
    expect(paths).toContainEqual(['c', 'nested', '1', 'else'])
  })

  test('a tree with duplicate nodes', () => {
    const nodes = []
    const paths = []
    const fn = jest.fn((node, path) => {
      nodes.push(node)
      paths.push(path)
    })
    const a = {
      hello: 'world'
    }
    const b = {
      a
    }
    const c = {
      a
    }

    const tree = {
      b,
      c
    }

    traverse(tree, fn)

    expect(fn).toHaveBeenCalledTimes(7)
    expect(nodes.length).toBe(7)
    expect(paths.length).toBe(7)
    expect(paths).toContainEqual([])
    expect(paths).toContainEqual(['b'])
    expect(paths).toContainEqual(['c'])
    expect(paths).toContainEqual(['b', 'a'])
    expect(paths).toContainEqual(['c', 'a'])
    expect(paths).toContainEqual(['b', 'a', 'hello'])
    expect(paths).toContainEqual(['c', 'a', 'hello'])
  })

  test('a tree with cycles', () => {
    const nodes = []
    const paths = []
    const fn = jest.fn((node, path) => {
      nodes.push(node)
      paths.push(path)
    })
    const a = { }
    const b = { }
    a.b = b
    b.a = a

    const tree = {
      a,
      b
    }

    expect(() => traverse(tree, fn)).not.toThrow()

    expect(fn).toHaveBeenCalledTimes(3)
    expect(nodes.length).toBe(3)
    expect(paths.length).toBe(3)
    expect(paths).toContainEqual([])
    expect(paths).toContainEqual(['a'])
    expect(paths).toContainEqual(['b'])
  })
})
