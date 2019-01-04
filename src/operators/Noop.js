import { Operator } from '../core/Operator'

/**
 * A simple way to visualize how much boilerplate is acutally needed to implement an op and refactor accordingly.
 * @ignore
 */
export class Noop extends Operator {
  getIntentions () {
    return this.makeIntentions()
  }

  consider (data, sourceOperator, action) {
  }
}
