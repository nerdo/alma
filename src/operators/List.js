import { Operator } from '../Operator'
import { action } from '../functions/action'
import { integerSequence } from '../helpers/integerSequence'
import { next } from '../helpers/next'

const EMPTY_ARRAY = []

export class List extends Operator {
  constructor () {
    super()
    this.idSequence = integerSequence(1)
    this.opMap = new WeakMap()
  }

  getOpName () { return 'List' }

  reset () {
    this.clear()
  }

  clear () {
    this.opMap = new Map()
    action(this, this.model, clear)
  }

  addItems (index, ops, resetOps = false) {
    const args = ops
      .map(op => [op, next(this.idSequence)])
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

  getOrder () {
    return this.getModelData(['order']) || EMPTY_ARRAY
  }

  getOpNames () {
    return this.getModelData(['opNames']) || EMPTY_ARRAY
  }

  consider (data, sourceOperator, actionName) {
    const incoming = this.getRelativeSlice(data)
    if (typeof incoming === 'undefined') { return }

    // TODO refactor actions
    true
  }

  nextAction (predicate) {
    if (typeof predicate === 'undefined') { return }
    if (predicate.proposal.$processor && this.pathBelongsToOp(predicate.path)) {
      if (predicate.proposal.$processor.name === 'addItems') {
        addItems.nextAction(this, this.model, predicate)
      }
    }
  }
}

List.START = 0
List.END = Number.MAX_SAFE_INTEGER

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
    const realIndex = Math.max(0, Math.min(order.length, index))
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
