/**
 * @interface
 */
export class ModelInterface {
  /**
   * Sets the supervisor.
   * @param {SupervisorInterface} supervisor
   * @returns {ModelInterface} this
   */
  setSupervisor (supervisor) { throw new Error('Not Yet Implemented') }

  /**
   * Gets the supervisor.
   * @returns {SupervisorInterface}
   */
  getSupervisor () { throw new Error('Not Yet Implemented') }

  /**
   * Sets the mutator.
   * @param {MutatorInterface} mutator
   * @returns {ModelInterface} this
   */
  setMutator (mutator) { throw new Error('Not Yet Implemented') }

  /**
   * Gets the mutator.
   * @returns {MutatorInterface}
   */
  getMutator () { throw new Error('Not Yet Implemented') }

  /**
   * Gets a value from the model data.
   * @param {*[]} path  - The path (list of keys) to pull the value from.
   * @param {*} [defaultValue] - The value to return if it is not defined.
   * @returns {*} the value on the path, or the default value if it was not defined.
   */
  get (path, defaultValue) { throw new Error('Not Yet Implemented') }

  /**
   * Sets a value in the model data.
   * @param {*[]} path  - The path (list of keys) to set the value on.
   * @param {*} value - The value to set in the model data.
   * @returns {Object} the model data with the value set.
   */
  set (path, value) { throw new Error('Not Yet Implemented') }

  /**
   * Deletes a property from an object.
   * @param {*[]} path  - The path (list of keys) of the property to delete.
   * @returns {Object} an object with the property deleted.
   */
  delete (path) { throw new Error('Not Yet Implemented') }

  /**
   * Sets the operator tree.
   * @param {Object} tree - A tree with Operator instances representing the system.
   * @returns {ModelInterface} this
   */
  setOpTree (tree) { throw new Error('Not Yet Implemented') }

  /**
   * Gets the operator tree.
   * @param {*[]} path - The path (list of keys) to pull the value from.
   * @returns {*} the subtree at path, or the entire tree if no path is defined.
   */
  getOpTree (path) { throw new Error('Not Yet Implemented') }

  /**
   * Mounts the operator tree into the current tree.
   * @param {Object} tree - A tree with Operator instances representing the system.
   * @returns {ModelInterface} this
   */
  mountOpTree (tree) { throw new Error('Not Yet Implemented') }

  /**
   * Considers data for acceptance.
   * @param {*} data - The data to consider.
   * @param {OperatorInterface} sourceOperator - The operator that proposed the action.
   * @param {Object} action - The proposed action.
   * @param {string} action.name - The name of the action.
   * @param {Object} [action.context] - Contextual information for the action.
   */
  consider (data, sourceOperator, action) { throw new Error('Not Yet Implemented') }

  /**
   * Resets the data and all operators.
   * @param {Object} [data=undefined] - Data to reset the model with.
   */
  reset (data = {}) { throw new Error('Not Yet Implemented') }

  /**
   * Calls postProcess on all operators.
   * @param {OperatorInterface} sourceOperator - The operator that proposed the action.
   * @param {Object} action - The proposed action.
   * @param {string} action.name - The name of the action.
   * @param {Object} [action.context] - Contextual information for the action.
   */
  postProcess (sourceOperator, action) { throw new Error('Not Yet Implemented') }
}
