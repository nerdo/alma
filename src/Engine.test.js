/* global describe, test, expect */
import { Engine } from './Engine'

describe('Engine', () => {
  test('instantiation', () => {
    const result = new Engine()
    expect(result).toBeDefined()
  })
})
