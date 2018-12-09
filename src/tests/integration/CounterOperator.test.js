/* global describe, test, expect */
import { setValue } from './CounterOperator'
import { conformanceTests } from '../../interfaces/ActionProcessorInterface.conformanceTests'

describe('CounterOperator', () => {
  conformanceTests(
    {
      setValue: () => setValue
    },
    describe,
    test,
    expect
  )
})
