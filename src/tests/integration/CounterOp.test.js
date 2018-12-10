/* global describe, test, expect */
import { setValue } from './CounterOp'
import { conformanceTests } from '../../interfaces/ActionProcessorInterface.conformanceTests'

describe('CounterOp', () => {
  conformanceTests(
    {
      setValue: () => setValue
    },
    describe,
    test,
    expect
  )
})
