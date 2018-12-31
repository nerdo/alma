/**
 * Generates an integer sequence.
 * @generator
 * @param {number} startingAt - The number to start the sequence at
 * @param {boolean} [startOverWhenMaxIntegerIsReached=true]
 */
export function integerSequence (startingAt = 0, startOverWhenMaxIntegerIsReached = true) {
  let integer

  return {
    next () {
      if (integer === void 0) {
        integer = startingAt
      } else if (integer === Number.MAX_SAFE_INTEGER) {
        if (startOverWhenMaxIntegerIsReached) {
          integer = startingAt
        } else {
          throw new Error('Number.MAX_SAFE_INTEGER reached!')
        }
      } else {
        integer++
      }

      return {
        done: startOverWhenMaxIntegerIsReached
          ? false
          : integer === Number.MAX_SAFE_INTEGER,
        value: integer
      }
    }
  }
}
