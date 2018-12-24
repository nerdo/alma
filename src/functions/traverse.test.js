/* global jest, describe, test, expect */
import { traverse } from './traverse'

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

  test('a tree with multiple levels', () => {
    const nodes = []
    const paths = []
    const fn = jest.fn((node, path) => {
      nodes.push(node)
      paths.push(path)
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
  })
})
