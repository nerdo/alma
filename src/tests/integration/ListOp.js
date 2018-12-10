import { AbstractOperator } from '../../AbstractOperator'
import { action } from '../../functions/action'
import { integerSequence } from '../../helpers/integerSequence'
import { next } from '../../helpers/next'

export class ListOp extends AbstractOperator {
  constructor () {
    super()
    this.idSequence = integerSequence()
    this.opMap = new WeakMap()
  }

  getOpName () { return 'ListOp' }

  reset () {
    this.clear()
  }

  clear () {
    this.opMap = new Map()
    action(this, this.model, clear)
  }

  addItem (op) {
    const id = next(this.idSequence)
    this.opMap.set(op, id)

    // This should technically be a next action... but how would we detect it, and give it context (the path)???
    // The reverse can also be said. It might be perfectly fine to do this but we should be able to respond
    // to the rejected proposal by undoing our pre-emptive work... Just refactored to pass a "fullProposal"
    // through to the nextAction() methods. TODO use path to find out if the proposal is for this op
    op.mount(this.model, this.getPath('items', id), this)

    action(this, this.model, addItem, { id })
  }

  getIdFor (op) {
    return this.opMap.get(op)
  }

  // nextAction (fullProposal) {
  //   console.log(fullProposal)
  // }
}

export const clear = {
  getProposal (op, model, { } = {}) {
    return { order: [], items: {} }
  },
  digest (op, model, incoming) {
    if (typeof incoming.order !== 'undefined') {
      model.set(op.getPath('order'), incoming.order)
    }
    if (typeof incoming.items !== 'undefined') {
      model.set(op.getPath('items'), incoming.items)
    }
  }
}

export const addItem = {
  getProposal (op, model, { id } = {}) {
    return { order: model.get(op.getPath('order'), []).concat(id) }
  },
  digest (op, model, incoming) {
    if (typeof incoming.order === 'undefined') { return }
    model.set(op.getPath('order'), incoming.order)
  }
}
