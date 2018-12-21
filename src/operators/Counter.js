import { Operator } from '../Operator'

export class Counter extends Operator {
  getOpName () { return 'Counter' }

  reset () {
    this.setValue()
  }

  setValue (value = 0) {
    this.propose('setValue', { value })
  }

  increment () {
    this.setValue(this.getModelData(['value'], 0) + 1)
  }

  decrement () {
    this.setValue(this.getModelData(['value'], 0) - 1)
  }

  consider (data, sourceOperator, actionName) {
    const incoming = this.getRelativeSlice(data)
    if (typeof incoming === 'undefined') { return }
    if (typeof incoming.value !== 'undefined') {
      this.model.set(this.getPath('value'), incoming.value)
    }
  }
}
