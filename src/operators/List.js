import { Operator } from '../core/Operator'
import { integerSequence } from '../helpers/integerSequence'
import { next } from '../helpers/next'

/**
 * @type {Array}
 */
const EMPTY_ARRAY = []

/**
 * @type {Object}
 */
const EMPTY_OBJECT = {}

/**
 * A generic List operator.
 * @class
 */
export class List extends Operator {
  /**
   * @ignore
   */
  constructor () {
    super()

    /**
     * @private
     * @type {Iterator}
     */
    this.idSequence = void 0

    /**
     * @private
     * @type {Map<OperatorInterface,number>}
     */
    this.opMap = void 0
  }

  /**
   * Gets a unique name for all instances of the operation.
   * @returns {string}
   */
  getOpName () {
    return 'List'
  }

  /**
   * Mounts the list to the model.
   * @param {ModelInterface} model - The model to mount the operator to.
   * @param {*[]} path  - The path (list of keys) in the model data to mount the operator to.
   * @param {OperatorInterface} [parentOp] - The op that is responsible for this operator.
   */
  mount (model, path, parentOp) {
    const response = super.mount(model, path, parentOp)

    // Find the highest id to use in the idSequence
    const maxId = this
      .getModelData(['order'], [])
      .reduce((max, current) => Math.max(max, current), 0)

    this.opMap = new Map()
    this.idSequence = integerSequence(maxId + 1)

    // TODO create instances of ops by using an opName to createOp() map

    return response
  }

  /**
   * Resets the list by calling {@link clear}.
   */
  reset () {
    this.clear()
  }

  /**
   * Clears the list.
   */
  clear () {
    this.propose('clear', {})
  }

  /**
   * Adds items to the list.
   * @param {number} index - The index at which to insert the items.
   * @param {OperatorInterface[]} ops - The operators to add.
   * @param {boolean} resetOps - Whether or not to reset the newly added operators.
   */
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
    const order = this.getModelData(['order'], [])
    const realIndex = Math.max(0, Math.min(order.length, index))
    order.splice(realIndex, 0, ...ids)
    const newOpNames = {
      ...this.getModelData(['opNames'], {}),
      ...opNames
    }

    this.propose(
      { name: 'addItems', context: { ids, resetOps } },
      { order, opNames: newOpNames }
    )
  }

  /**
   * Moves operators in the list.
   * @param {OperatorInterface[]} ops - The operators to move.
   * @param {number} index - The index in the list to move the operators to.
   */
  moveItems (ops, index) {
    // Get list of IDs for ops.
    const ids = ops
      .map(op => this.getIdFor(op))
      .filter(op => op)

    // Remove IDs from order.
    const order = this.getModelData(['order'], [])
      .filter(id => !ids.includes(id))

    // Insert IDs into new location
    order.splice(index, 0, ...ids)
    this.propose('moveItems', { order })
  }

  /**
   * Gets the ID for the operator in the list.
   * @param {OperatorInterface} op - The operator to get the ID for.
   * @returns {number}
   */
  getIdFor (op) {
    return this.opMap.get(op)
  }

  /**
   * Gets an operator in the list by ID.
   * @param {number} findId - The ID to look for.
   * @returns {OperatorInterface}
   */
  getOpById (findId) {
    return Array.from(this.opMap.entries())
      .filter(([op, id]) => id === findId)
      .map(([op]) => op)[0]
  }

  /**
   * Gets the order of items in the list as an array of operator IDs.
   * @returns {number[]}
   */
  getOrder () {
    return this.getModelData(['order']) || EMPTY_ARRAY
  }

  /**
   * Gets the operator names.
   * @returns {Object.<string, string>} Object of operator names, keyed by the string version of the ID.
   */
  getOpNames () {
    return this.getModelData(['opNames']) || EMPTY_OBJECT
  }

  /**
   * Considers data for acceptance.
   * @param {*} data - The data to consider.
   * @param {OperatorInterface} sourceOperator - The operator that proposed the action.
   * @param {Object} action - The proposed action.
   * @param {string} action.name - The name of the action.
   * @param {Object} [action.context] - Contextual information for the action.
   */
  consider (data, sourceOperator, action) {
    const incoming = this.getRelativeSlice(data)
    if (typeof incoming === 'undefined') { return }

    if (action.name === 'addItems') {
      if (typeof incoming.order === 'undefined' || typeof incoming.opNames === 'undefined') { return }
      this.setModelData(['order'], incoming.order)
      this.setModelData(['opNames'], incoming.opNames)
    } else if (action.name === 'clear') {
      this.model.set(this.getPath(), { order: [], items: {}, opNames: {} })
    } else if (action.name === 'moveItems') {
      this.setModelData(['order'], incoming.order)
    }
  }

  /**
   * Called by an alma engine to allow the operator to post-process actions.
   * @param {OperatorInterface} sourceOperator - The operator that proposed the action.
   * @param {Object} action - The proposed action.
   * @param {string} action.name - The name of the action.
   * @param {Object} [action.context] - Contextual information for the action.
   */
  nextAction (sourceOperator, action) {
    if (sourceOperator !== this) { return }

    if (action.name === 'addItems') {
      // Mount added operators.
      const context = action.context
      context.ids
        .map(id => {
          return { id, op: this.getOpById(id) }
        })
        .filter(item => item)
        .map(item => {
          item.op.mount(this.getModel(), this.getPath('items', item.id), this)
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
      this.idSequence = integerSequence(1)
    }
  }
}

List.START = 0
List.END = Number.MAX_SAFE_INTEGER
