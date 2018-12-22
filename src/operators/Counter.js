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

  consider (data, sourceOperator, action) {
    const incoming = this.getRelativeSlice(data)
    if (typeof incoming === 'undefined') { return }
    if (typeof incoming.value !== 'undefined') {
      this.setModelData(['value'], incoming.value)
    }
  }
}
