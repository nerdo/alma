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

  addItems (index, ops, resetOps = false) {
    const args = ops
      .map(op => [op, next(this.idSequence)] )
      .map(([ op, id, opName ]) => {
        this.opMap.set(op, id)
        // op.mount(this.model, this.getPath('items', id), this)
        return { id, opName: op.getOpName() }
      })
      .reduce(
        function (result, { id, opName }) {
          result.ids.push(id)
          result.opNames[id] = opName
          return result
        },
        { ids: [], opNames: {} }
      )

    action(this, this.model, addItems, { index, ...args, resetOps })
  }

  moveItems (ops, index) {
    const ids = ops
      .map(op => this.getIdFor(op))
      .filter(op => op)

    action(this, this.model, moveItems, { index, ids })
  }

  getIdFor (op) {
    return this.opMap.get(op)
  }

  getItemById (findId) {
    return Array.from(this.opMap.entries())
      .filter(([op, id]) => id === findId)
      .map(([op]) => op)[0]
  }

  nextAction (predicate) {
    if (predicate.proposal.$processor && this.pathBelongsToOp(predicate.path)) {
      if (predicate.proposal.$processor.name === 'addItems') {
        addItems.nextAction(this, this.model, predicate)
      }
    }
  }
}

ListOp.START = 0
ListOp.END = Number.MAX_SAFE_INTEGER

export const clear = {
  getProposal (op, model, { } = {}) {
    return { order: [], items: {}, opNames: {} }
  },
  digest (op, model, incoming) {
    if (typeof incoming.order !== 'undefined') {
      model.set(op.getPath('order'), incoming.order)
    }
    if (typeof incoming.items !== 'undefined') {
      model.set(op.getPath('items'), incoming.items)
    }
    if (typeof incoming.opNames !== 'undefined') {
      model.set(op.getPath('opNames'), incoming.opNames)
    }
  }
}

export const addItems = {
  getProposal (op, model, { index, ids, opNames, resetOps } = {}) {
    const order = model.get(op.getPath('order'), [])
    const realIndex = Math.min(order.length - 1, Math.max(0, index))
    order.splice(realIndex, 0, ...ids)
    const newOpNames = {
      ...model.get(op.getPath('opNames'), {}),
      ...opNames
    }
    const $processor = {
      name: 'addItems', args: { ids, resetOps }
    }
    return { order, opNames: newOpNames, $processor }
  },
  digest (op, model, incoming) {
    if (typeof incoming.order === 'undefined' || typeof incoming.opNames === 'undefined') { return }
    model.set(op.getPath('order'), incoming.order)
    model.set(op.getPath('opNames'), incoming.opNames)
  },
  nextAction (op, model, predicate) {
    const args = predicate.proposal.$processor.args
    args.ids
      .map(id => {
        return { id, op: op.getItemById(id) }
      })
      .filter(item => item)
      .map(item => {
        item.op.mount(op.model, op.getPath('items', item.id), op)
        return item
      })
      .map(item => {
        if (args.resetOps) {
          item.op.reset()
        }
        return item
      })
  }
}

export const moveItems = {
  getProposal (op, model, { index, ids } = {}) {
    const order = model.get(op.getPath('order'), [])
      .filter(id => !ids.includes(id))
    order.splice(index, 0, ...ids)
    return { order }
  },
  digest (op, model, incoming) {
    if (typeof incoming.order === 'undefined') { return }
    model.set(op.getPath('order'), incoming.order)
  }
}
