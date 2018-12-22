/* global describe, test, expect */
import { setupCustomMatchers } from '../helpers/jest'
import { SupervisorInterface } from './SupervisorInterface'
import { Supervisor } from '../Supervisor'

setupCustomMatchers(expect)

const newSupervisor = () => new Supervisor()

describe('SupervisorInterface conformance of', () => {
  test.each`
    concreteImplementationName | newInstance
    ${'Supervisor'}               | ${newSupervisor}
  `('$concreteImplementationName', ({ newInstance }) => {
  const supervisor = newInstance()
  expect(supervisor).toImplement(SupervisorInterface)

  let setPresenterResult
  expect(() => setPresenterResult = supervisor.setPresenter(null)).not.toThrow()
  expect(setPresenterResult).toBe(supervisor)
  expect(supervisor.getPresenter()).toBe(null)

  let setNextActionDelegatesResult
  const before = () => {}
  const after = () => {}
  expect(() => setNextActionDelegatesResult = supervisor.setNextActionDelegates(before, after)).not.toThrow()
  expect(setNextActionDelegatesResult).toBe(supervisor)
  expect(supervisor.getNextActionDelegates()).toEqual([before, after])
})
})
