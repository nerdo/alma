/* global describe, test, expect */
import { TestPresenter } from './TestPresenter'

describe('TestPresenter', () => {
  test('instantiation', () => {
    const result = new TestPresenter()
    expect(result).toBeDefined()
  })
})
