/* global describe, test, expect */
import { setValue } from './CounterOperative'
import { conformanceTests } from '../../interfaces/ActionProcessorInterface.conformanceTests'

describe('CounterOperative', () => {
  conformanceTests(
    {
      setValue: () => setValue
    },
    describe,
    test,
    expect
  )
})
