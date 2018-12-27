/**
 * Generates an integer sequence.
 * @generator
 * @param {number} startingAt - The number to start the sequence at
 * @param {boolean} [startOverWhenMaxIntegerIsReached=true]
 */
export function * integerSequence (startingAt = 0, startOverWhenMaxIntegerIsReached = true) {
  let integer = startingAt
  while (true) {
    if (integer === Number.MAX_SAFE_INTEGER) {
      if (startOverWhenMaxIntegerIsReached) {
        integer = startingAt
      } else {
        throw new Error('Number.MAX_SAFE_INTEGER reached!')
      }
    }

    yield integer++
  }
}
