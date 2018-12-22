import { NormalMutator } from './adapters/NormalMutator'
import { workLeafNodes } from './functions/workLeafNodes'

const normalMutatorSingleton = new NormalMutator()

export class Model {
  /**
   * Creates a new model.
   * @param {Object} [data={}] - The data to set in the model.
   * @param {MutatorInterface} [mutator=new NormalMutator()] - The mutator that should be used to get and set data.
   */
  constructor (data = {}, mutator = new NormalMutator()) {
    this.setMutator(mutator)
    this.data = data
    this.opTree = {}
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
    workLeafNodes(tree, (path, op) => op.mount(this, path))
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
   * Resets the data and all operators.
   * @param {Object} [data=undefined] - Data to reset the model with.
   */
  reset (data = {}) {
    this.data = data
    workLeafNodes(this.opTree, (path, op) => op.reset())
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
    workLeafNodes(this.opTree, (path, op) => op.consider(data, sourceOperator, action))
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
    workLeafNodes(
      this.opTree,
      (path, op) => {
        if (!op.nextAction) { return }
        op.nextAction(sourceOperator, action)
        op.getNestedOps().map(nested => nested.nextAction ? nested.nextAction(sourceOperator, action) : null)
      },
      (path, op) => {
        // Detect operators as leaf nodes by doing some pretty simple type checks on the OperatorInterface.
        return op &&
          typeof op.mount === 'function' &&
          typeof op.getPath === 'function' &&
          typeof op.getModelData === 'function'
      }
    )
  }
}
