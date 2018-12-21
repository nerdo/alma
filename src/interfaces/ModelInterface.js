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
   * Considers data for acceptance.
   * @param {*} data - The data to consider.
   * @param {OperatorInterface} sourceOperator - The operator that initiated the change.
   * @param {string} - The action the data is coming from.
   */
  consider (data, sourceOperator, actionName) { throw new Error('Not Yet Implemented') }

  /**
   * Resets the data and all operators.
   * @param {Object} [data=undefined] - Data to reset the model with.
   */
  reset (data = {}) { throw new Error('Not Yet Implemented') }

  /**
   * Calls nextAction on all operators.
   * @param {Object} predicate - The full proposal that was processed by the model.
   */
  nextAction (predicate) { throw new Error('Not Yet Implemented') }
}
