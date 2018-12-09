import { AbstractOperative } from '../../AbstractOperative';
import { action } from '../../functions/action'
import { defaults } from '../../functions/defaults'

export class CounterOperative extends AbstractOperative {
  reset () {
    this.setValue()
  }

  setValue ({ value = 0 } = {}) {
    action(this, this.model, setValue, { value })
  }

  increment () {
    this.setValue({ value: this.model.get(this.getPath('value'), defaults(this, this.model, setValue).value) + 1 })
  }

  decrement () {
    this.setValue({ value: this.model.get(this.getPath('value'), defaults(this, this.model, setValue).value) - 1 })
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