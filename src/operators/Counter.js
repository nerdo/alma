import { Operator } from '../core/Operator'

/**
 * @ignore
 */
export class Counter extends Operator {
  getOpName () {
    return 'Counter'
  }

  reset () {
    this.setValue()
  }

  setValue (value = 0) {
    this.propose('setValue', { value })
  }

  getValue () {
    return this.getModelData(['value'], 0)
  }

  increment () {
    this.setValue(this.getValue() + 1)
  }

  decrement () {
    this.setValue(this.getValue() - 1)
  }

  consider (data, sourceOperator, action) {
    const incoming = this.getRelativeSlice(data)
    if (typeof incoming === 'undefined') {
      return
    }
    if (typeof incoming.value !== 'undefined') {
      this.setModelData(['value'], incoming.value)
    }
  }
}
