import { Operator } from '../Operator'
import { action } from '../functions/action'
import { integerSequence } from '../helpers/integerSequence'
import { next } from '../helpers/next'

const EMPTY_ARRAY = []

export class List extends Operator {
  constructor () {
    super()
    this.idSequence = integerSequence(1) // This should really get set after mounting, so the sequence # can be set to Number.max(id) + 1
    this.opMap = new WeakMap()
  }

  getOpName () { return 'List' }

  reset () {
    this.clear()
  }

  clear () {
    this.propose('clear', {})
  }

  addItems (index, ops, resetOps = false) {
    const {
      ids,
      opNames
    } = ops
      .map(op => [op, next(this.idSequence)])
      .map(([ op, id, opName ]) => {
        this.opMap.set(op, id)
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
    const order = this.model.get(this.getPath('order'), [])
    const realIndex = Math.max(0, Math.min(order.length, index))
    order.splice(realIndex, 0, ...ids)
    const newOpNames = {
      ...this.model.get(this.getPath('opNames'), {}),
      ...opNames
    }

    this.propose(
      { name: 'addItems', context: { ids, resetOps } },
      { order, opNames: newOpNames }
    )
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

  consider (data, sourceOperator, action) {
    const incoming = this.getRelativeSlice(data)
    if (typeof incoming === 'undefined') { return }

    if (action.name === 'addItems') {
      if (typeof incoming.order === 'undefined' || typeof incoming.opNames === 'undefined') { return }
      this.model.set(this.getPath('order'), incoming.order)
      this.model.set(this.getPath('opNames'), incoming.opNames)
    } else if (action.name === 'clear') {
      this.model.set(this.getPath(), { order: [], items: {}, opNames: {} })
    }
  }

  nextAction (sourceOperator, action) {
    if (sourceOperator !== this) { return }

    if (action.name === 'addItems') {
      // Mount added operators.
      const context = action.context
      context.ids
        .map(id => {
          return { id, op: this.getItemById(id) }
        })
        .filter(item => item)
        .map(item => {
          item.op.mount(this.model, this.getPath('items', item.id), this)
          return item
        })
        .map(item => {
          if (context.resetOps) {
            item.op.reset()
          }
          return item
        })
    } else if (action.name === 'clear') {
      this.opMap = new Map()
    }
  }
}

List.START = 0
List.END = Number.MAX_SAFE_INTEGER

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
