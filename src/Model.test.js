/* global describe, test, expect */
import { Model } from './Model'

describe('Model', () => {
  test('instantiation', () => {
    const result = new Model()
    expect(result).toBeDefined()
  })
})
