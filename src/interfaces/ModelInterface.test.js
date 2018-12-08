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

      expect(() => model.setSupervisor(null)).not.toThrow()
      expect(model.getSupervisor()).toBe(null)

      expect(() => model.setMutator(null)).not.toThrow()
      expect(model.getMutator()).toBe(null)

      expect(() => model.setOpTree({})).not.toThrow()
      expect(model.getOpTree()).toMatchObject({})

      expect(() => model.reset()).not.toThrow()
    })
})
