/* global describe, test, expect */
import { Supervisor } from './Supervisor'

describe('Supervisor', () => {
  test('instantiation', () => {
    const result = new Supervisor()
    expect(result).toBeDefined()
  })
})
