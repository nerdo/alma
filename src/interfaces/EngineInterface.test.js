/* global describe, test, expect */
import { setupCustomMatchers } from '../helpers/jest'
import { EngineInterface } from './EngineInterface'
import { Engine } from '../Engine'
import { TestPresenter } from '../adapters/TestPresenter'

setupCustomMatchers(expect)

const newEngine = () => new Engine(new TestPresenter())

describe('EngineInterface conformance of', () => {
  test.each`
    concreteImplementationName | newInstance
    ${'Engine'}                | ${newEngine}
  `('$concreteImplementationName', ({ newInstance }) => {
  const engine = newInstance()
  expect(engine).toImplement(EngineInterface)

  let resetResult
  expect(() => resetResult = engine.reset()).not.toThrow()
  expect(resetResult).toBe(engine)

  let startResult
  expect(() => startResult = engine.start()).not.toThrow()
  expect(startResult).toBe(engine)

  let setPresenterResult
  expect(() => setPresenterResult = engine.setPresenter(null)).not.toThrow()
  expect(setPresenterResult).toBe(engine)
  expect(engine.getPresenter()).toBe(null)

  let setSupervisorResult
  expect(() => setSupervisorResult = engine.setSupervisor(null)).not.toThrow()
  expect(setSupervisorResult).toBe(engine)
  expect(engine.getSupervisor()).toBe(null)

  let setModelResult
  expect(() => setModelResult = engine.setModel(null)).not.toThrow()
  expect(setModelResult).toBe(engine)
  expect(engine.getModel()).toBe(null)
})
})
