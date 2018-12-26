import { NormalMutator } from '../adapters/NormalMutator'
import { traverse, defaultGetChildren } from '../functions/traverse'

/**
 * @type {MutatorInterface}
 */
const normalMutatorSingleton = new NormalMutator()

/**
 * The core ModelInterface implementation.
 * @class
 * @implements {ModelInterface}
 */
export class Model {
  /**
   * Creates a new model.
   * @param {Object} [data={}] - The data to set in the model.
   * @param {MutatorInterface} [mutator=new NormalMutator()] - The mutator that should be used to get and set data.
   */
  constructor (data = {}, mutator = new NormalMutator()) {
    /**
     * @private
     * @type {MutatorInterface}
     */
    this.mutator = void 0

    /**
     * @private
     * @type {SupervisorInterface}
     */
    this.supervisor = void 0

    /**
     * @private
     * @type {Object}
     */
    this.data = data

    /**
     * @private
     * @type {Object}
     */
    this.opTree = {}

    this.setMutator(mutator)
  }

  /**
   * Sets the supervisor.
   * @param {SupervisorInterface} supervisor
   * @returns {ModelInterface} this
   */
  setSupervisor (supervisor) {
    this.supervisor = supervisor
    return this
  }

  /**
   * Gets the supervisor.
   * @returns {SupervisorInterface}
   */
  getSupervisor () {
    return this.supervisor
  }

  /**
   * Sets the mutator.
   * @param {MutatorInterface} mutator
   * @returns {ModelInterface} this
   */
  setMutator (mutator) {
    this.mutator = mutator
    return this
  }

  /**
   * Gets the mutator.
   * @returns {MutatorInterface}
   */
  getMutator () {
    return this.mutator
  }

  /**
   * Gets a value from the model data.
   * @param {*[]} path  - The path (list of keys) to pull the value from.
   * @param {*} [defaultValue] - The value to return if it is not defined.
   * @returns {*} the value on the path, or the default value if it was not defined.
   */
  get (path, defaultValue) {
    return this.mutator.get(this.data, path, defaultValue)
  }

  /**
   * Sets a value in the model data.
   * @param {*[]} path  - The path (list of keys) to set the value on.
   * @param {*} value - The value to set in the model data.
   * @returns {Object} the model data with the value set.
   */
  set (path, value) {
    this.data = this.mutator.set(this.data, path, value)
    return this
  }

  /**
   * Sets the operator tree.
   * @param {Object} tree - A tree with Operator instances representing the system.
   * @returns {ModelInterface} this
   */
  setOpTree (tree) {
    this.opTree = tree
    return this
  }

  /**
   * Gets the operator tree.
   * @param {*[]} path  - The path (list of keys) to pull the value from.
   * @returns {*} the subtree at path, or the entire tree if no path is defined.
   */
  getOpTree (path) {
    return normalMutatorSingleton.get(this.opTree, path)
  }

  /**
   * Mounts the operator tree into the current tree.
   * @param {Object} tree - A tree with Operator instances representing the system.
   * @returns {ModelInterface} this
   */
  mountOpTree (tree) {
    traverseOpTree(
      tree,
      (node, path) => {
        if (!isOp(node)) {
          return
        }
        node.mount(this, path)
      }
    )
    // workLeafNodes(tree, (path, op) => op.mount(this, path))
    return this
  }

  /**
   * Resets the data and all operators.
   * @param {Object} [data=undefined] - Data to reset the model with.
   */
  reset (data = {}) {
    this.data = data
    // workLeafNodes(this.opTree, (path, op) => op.reset())
    traverseOpTree(
      this.opTree,
      (node, path) => {
        if (!isOp(node)) {
          return
        }
        node.reset()
      }
    )
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
    // workLeafNodes(this.opTree, (path, op) => op.consider(data, sourceOperator, action))
    traverseOpTree(
      this.opTree,
      (node, path) => {
        if (!isOp(node)) {
          return
        }
        node.consider(data, sourceOperator, action)
      }
    )
    this.supervisor.process(this, sourceOperator, action)
  }

  /**
 * Calls nextAction on all operators.
 * @param {OperatorInterface} sourceOperator - The operator that proposed the action.
 * @param {Object} action - The proposed action.
 * @param {string} action.name - The name of the action.
 * @param {Object} [action.context] - Contextual information for the action.
 */
  nextAction (sourceOperator, action) {
    traverseOpTree(
      this.opTree,
      (node, path) => {
        if (!isOp(node)) {
          return
        }
        if (typeof node.nextAction !== 'function') {
          return
        }
        node.nextAction(sourceOperator, action)
      }
    )
  }
}

/**
 * Traverses the op tree.
 * @private
 * @param {*} tree - The tree to traverse.
 * @param {Function} callback - The tree traversal callback function.
 */
function traverseOpTree (tree, callback) {
  traverse(
    tree,
    callback,
    (node, path) => {
      return defaultGetChildren(node, path)
        .concat(
          isOp(node)
            ? node
              .getNestedOps()
              .reduce((ops, current) => ops.concat({ path: node.getPath(), node }), [])
            : []
        )
    }
  )
}

/**
 * Returns whether or not a variable is an operator.
 * @private
 * @param {*} subject - The subject being tested.
 * @returns {boolean}
 */
function isOp (subject) {
  return subject &&
    typeof subject.mount === 'function' &&
    typeof subject.getPath === 'function' &&
    typeof subject.getModelData === 'function'
}
