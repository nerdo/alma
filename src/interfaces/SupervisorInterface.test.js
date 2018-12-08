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

      expect(() => supervisor.setPresenter(null)).not.toThrow()
      expect(supervisor.getPresenter()).toBe(null)
    })
})
