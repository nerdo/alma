/* global describe, test, expect */
import { setValue } from './Counter'
import { conformanceTests } from '../../interfaces/ActionProcessorInterface.conformanceTests'

describe('Counter', () => {
  conformanceTests(
    {
      setValue: () => setValue
    },
    describe,
    test,
    expect
  )
})
