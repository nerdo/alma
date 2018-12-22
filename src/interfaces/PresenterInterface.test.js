/* global describe, test, expect */
import { setupCustomMatchers } from '../helpers/jest'
import { PresenterInterface } from './PresenterInterface'
import { TestPresenter } from '../adapters/TestPresenter'

setupCustomMatchers(expect)

const newPresenter = () => new TestPresenter()

describe('PresenterInterface conformance of', () => {
  test.each`
    concreteImplementationName | newInstance
    ${'TestPresenter'}               | ${newPresenter}
  `('$concreteImplementationName', ({ newInstance }) => {
  const presenter = newInstance()
  expect(presenter).toImplement(PresenterInterface)

  expect(() => presenter.render({})).not.toThrow()
})
})
