/* global describe, test, expect */
import { setupCustomMatchers } from '../helpers/jest'
import { ModelInterface } from './ModelInterface'
import { Model } from '../Model'

setupCustomMatchers(expect)

const newModel = () => new Model()

describe('ModelInterface conformance of', () => {
  test.each`
    concreteImplementationName | newInstance
    ${'Model'}               | ${newModel}
  `('$concreteImplementationName', ({ newInstance }) => {
  const model = newInstance()
  expect(model).toImplement(ModelInterface)

  const setResult = model.set([], {})
  expect(setResult).toBe(model)

  let setSupervisorResult
  expect(() => { setSupervisorResult = model.setSupervisor(null) }).not.toThrow()
  expect(setSupervisorResult).toBe(model)
  expect(model.getSupervisor()).toBe(null)

  let setMutatorResult
  expect(() => { setMutatorResult = model.setMutator(null) }).not.toThrow()
  expect(setMutatorResult).toBe(model)
  expect(model.getMutator()).toBe(null)

  let setOpTreeResult
  expect(() => { setOpTreeResult = model.setOpTree({}) }).not.toThrow()
  expect(setOpTreeResult).toBe(model)
  expect(model.getOpTree()).toMatchObject({})

  expect(() => model.reset()).not.toThrow()
})
})
