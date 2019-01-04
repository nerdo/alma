/* global describe, test, expect */
import { Noop } from './Noop'
import { operatorConformanceTests } from '../helpers/operatorConformanceTests'

describe('Noop', () => {
  operatorConformanceTests(
    {
      Noop: () => new Noop()
    },
    describe,
    test,
    expect
  )
})
