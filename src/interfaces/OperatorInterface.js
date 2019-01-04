/**
 * @interface
 */
export class OperatorInterface {
  /**
   * Gets a unique name for all instances of the operation.
   * @returns {string}
   */
  getOpName () { throw new Error('Not Yet Implemented') }

  /**
   * Mounts an operator and any nested operators to the model.
   *
   * This will typically be:<pre><code>this.model = model
   * this.path = path
   * mount(this, this.model, this.path, parentOp) // mount helper function, imported from alma</code></pre>
   * @param {ModelInterface} model - The model to mount the operator to.
   * @param {*[]} path  - The path (list of keys) in the model data to mount the operator to.
   * @param {OperatorInterface} [parentOp] - The op that is responsible for this operator.
   */
  mount (model, path, parentOp) { throw new Error('Not Yet Implemented') }

  /**
   * Unmounts an operator and any nested operators from the model.
   * After this function call is completed:
   *  The operator should no longer be in the optree at its specified path.
   *  The operators data should no longer be present in the model.
   */
  unmount () { throw new Error('Not Yet Implemented') }

  /**
   * Nests an operator within this one.
   * @param {OperatorInterface} op - The operator to add.
   * @param {*[]} relativePath - Te path it should be mounted on, relative to the current op.
   */
  addNestedOp (op, relativePath) { throw new Error('Not Yet Implemented') }

  /**
   * Removes an op that was nested in this one.
   * @param {OperatorInterface} op - The operator to remove.
   */
  removeNestedOp (op) { throw new Error('Not Yet Implemented') }

  /**
   * Gets a list of operators nested within this one.
   * @returns {[OperatorInterface]}
   */
  getNestedOps () { throw new Error('Not Yet Implemented') }

  /**
   * Gets the path to model data, relative to the operator's path.
   *
   * This will typically be:<pre><code>return (this.path || []).concat(relative)</code></pre>
   * ...where this.path is the instance variable storing the operator's path.
   * @param  {...any} relative - Relative path to the target.
   * @returns {*[]}
   */
  getPath (...relative) { throw new Error('Not Yet Implemented') }

  /**
   * Resets the operator.
   *
   * This will typically call all actions with default parameters and call reset on any nested operators.
   */
  reset () { throw new Error('Not Yet Implemented') }

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
   * Gets an object containing selectors (functions) that retrieve data from the op.
   * @returns {Object.<string, Function>}
   */
  getSelectors () { throw new Error('Not Yet Implemented') }

  /**
   * Gets an object containing "intentions" (functions) which try to perform actions on the op.
   * @returns {Object.<string, Function>}
   */
  getIntentions () { throw new Error('Not Yet Implemented') }

  /**
   * Optional. Called by an alma engine to allow the operator to post-process actions.
   * @function
   * @name OperatorInterface#postProcess
   * @param {OperatorInterface} sourceOperator - The operator that proposed the action.
   * @param {Object} action - The proposed action.
   * @param {string} action.name - The name of the action.
   * @param {Object} [action.context] - Contextual information for the action.
   */
  // postProcess (sourceOperator, action) { throw new Error('Not Yet Implemented') // }
}
