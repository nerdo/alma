import { Operator } from '../core/Operator'
import { integerSequence } from '../helpers/integerSequence'
import { next } from '../helpers/next'
import { Engine } from '../core/Engine'

/**
 * @type {Array}
 */
const EMPTY_ARRAY = Object.freeze([])

/**
 * @type {Object}
 */
const EMPTY_OBJECT = Object.freeze({})

/**
 * A generic List operator.
 * @class
 */
export class List extends Operator {
  /**
   * Creates a List of operators.
   * @param  {...OperatorInterface} ops - The iniial set of operators in the list.
   */
  constructor (...ops) {
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

    /**
     * @private
     * @type {OperatorInterface[]}
     */
    this.constructorOps = ops

    /**
     * @private
     * @type {Object}
     */
    this.opCreators = void 0
  }

  /**
   * Sets op creators.
   * @param {Object.<string, function>} opCreators - A map of op names and functions that return new instances of ops.
   * @returns {List} this
   */
  setOpCreators (opCreators) {
    this.opCreators = opCreators
    return this
  }

  /**
   * Gets op creators.
   * @returns {Object.<string, function>} - A map of op names and functions that return new instances of ops.
   */
  getOpCreators () {
    return this.opCreators
  }

  /**
   * Gets a unique name for all instances of the operation.
   * @returns {string}
   */
  getOpName () {
    return 'List'
  }

  /**
   * Gets an object containing selectors (functions) that retrieve data from the op.
   * @returns {Object.<string, Function>}
   */
  getSelectors () {
    return this.makeSelectors(
      this.getIdFor,
      this.getOpById,
      this.getMaxId,
      this.getOpCreators,
      this.getOpNames
    )
  }

  /**
   * Gets an object containing "intentions" (functions) which try to perform actions on the op.
   * @returns {Object.<string, Function>}
   */
  getIntentions () {
    return this.makeIntentions(
      this.setOpCreators,
      this.addItems
    )
  }

  /**
   * Mounts the list to the model.
   * @param {ModelInterface} model - The model to mount the operator to.
   * @param {*[]} path  - The path (list of keys) in the model data to mount the operator to.
   * @param {OperatorInterface} [parentOp] - The op that is responsible for this operator.
   */
  mount (model, path, parentOp) {
    const response = super.mount(model, path, parentOp)

    this.opMap = this.opMap || new Map()
    this.idSequence = this.idSequence || integerSequence(this.getMaxId() + 1)

    // Create instances of ops with opCreators.
    if (this.opCreators) {
      const ops = this.getModelData(['order'], [])
        .map(id => [id, this.getModelData(['opNames', `${id}`])])
        .map(([id, opName]) => {
          const opCreator = this.opCreators[opName]
          if (typeof opCreator !== 'function') {
            return [id]
          }
          return [id, opCreator()]
        })
        .filter(([, op]) => op)

      for (const [id, op] of ops) {
        this.opMap.set(op, id)
        op.mount(this.getModel(), this.getPath('items', id), this)
      }
    }

    return response
  }

  /**
   * Resets all items in the list.
   */
  reset () {
    const items = this.getModelData(['items'], {})
    const opNames = this.getOpNames()
    const order = this.getOrder()

    this.propose('reset', { items, opNames, order })
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
   * @param {Object} context - Context about the items that will be available in postProcess.
   * @param {boolean} [context.resetOps=false] - Whether or not to reset the newly added operators.
   * @param {number[]} context.ids - Reserved. Will be an array of IDs that were added.
   */
  addItems (index, ops, context = { resetOps: false }) {
    const alteredContext = { ...context }
    alteredContext.resetOps = alteredContext.resetOps || false
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
      { name: 'addItems', context: { ids, ...alteredContext } },
      { order, opNames: newOpNames }
    )
  }

  /**
   * Deletes the operators from the list.
   * @param {OperatorInterface} ops
   */
  deleteItems (ops) {
    const { ids, deletingOps } = ops
      .map(op => [this.getIdFor(op), op])
      .filter(([id]) => id)
      .reduce(
        (container, current) => {
          container.ids.push(current[0])
          container.deletingOps.push(current[1])
          return container
        },
        { ids: [], deletingOps: [] }
      )

    const order = this.getModelData(['order'], [])
      .filter(id => !ids.includes(id))

    const opNames = { ...this.getModelData(['opNames'], {}) }
    for (const id of ids) {
      delete opNames[id]
    }

    this.propose(
      { name: 'deleteItems', context: { ops: deletingOps } },
      { order, opNames }
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
      .filter(id => id)

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
   * Gets all ops in the list, in order.
   * @returns {[OperatorInterface]}
   */
  getOps () {
    return this.getModelData(['order'], [])
      .map(id => this.getOpById(id))
      .filter(op => op)
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
    if (sourceOperator !== this || typeof incoming === 'undefined') {
      return
    }

    if (action.name === 'reset') {
      this.setModelData(['order'], incoming.order)
      this.setModelData(['items'], incoming.items)
      this.setModelData(['opNames'], incoming.opNames)

      // Reset nested ops.
      for (const op of this.getNestedOps()) {
        op.reset()
      }
    } else if (action.name === 'addItems') {
      if (typeof incoming.order === 'undefined' || typeof incoming.opNames === 'undefined') {
        return
      }
      this.setModelData(['order'], incoming.order)
      this.setModelData(['opNames'], incoming.opNames)

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
    } else if (action.name === 'deleteItems') {
      this.setModelData(['order'], incoming.order)
      this.setModelData(['opNames'], incoming.opNames)

      // Unmount deleted operators.
      const context = action.context
      for (const op of context.ops) {
        op.unmount()
      }
    } else if (action.name === 'clear') {
      this.setModelData([], { order: [], items: {}, opNames: {} })

      // Unmount ops and reset the op map and id sequences.
      for (const op of this.opMap.keys()) {
        op.unmount()
      }

      this.opMap = new Map()
      this.idSequence = integerSequence(1)
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
  postProcess (sourceOperator, action) {
    if (action.name === Engine.START_ACTION.name) {
      // Add ops from the constructor.
      if (this.constructorOps) {
        const ops = this.constructorOps
        delete this.constructorOps
        this.addItems(List.END, ops)
      }
    }
  }

  /**
   * Gets the maximum id in the current data.
   * @private
   * @returns {number}
   */
  getMaxId () {
    // Find the highest id to use in the idSequence
    return (this.getModelData(['order'], []) || [])
      .reduce((max, current) => Math.max(max, current), 0)
  }
}

List.START = 0
List.END = Number.MAX_SAFE_INTEGER
