export class UnmountedOperatorError extends Error {
  constructor (op) {
    super(`Unmounted Operator: ${op.getOpName()}.`)
  }
}
