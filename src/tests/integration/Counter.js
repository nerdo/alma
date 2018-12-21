import { Operator } from '../../Operator'
import { action } from '../../functions/action'

export class Counter extends Operator {
  getOpName () { return 'Counter' }

  reset () {
    this.setValue()
  }

  setValue (value) {
    action(this, this.model, setValue, { value })
  }

  increment () {
    this.setValue(this.getModelData(['value'], setValue) + 1)
  }

  decrement () {
    this.setValue(this.getModelData(['value'], setValue) - 1)
  }
}

export const setValue = {
  getProposal (op, model, { value = 0 } = {}) {
    return { value }
  },
  digest (op, model, incoming) {
    if (typeof incoming.value === 'undefined') { return }
    model.set(op.getPath('value'), incoming.value)
  }
}
