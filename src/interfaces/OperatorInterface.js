export class OperatorInterface {
  /**
   * Gets a unique name for all instances of the operation.
   * @returns {string}
   */
  getOpName () { throw new Error('Not Yet Implemented') }

  /**
   * Mounts an operator to the model.
   *
   * This will typically be:<pre><code>
   * this.model = model
   * this.path = path
   * mount(this, this.model, this.path, parentOp) // mount helper function, imported from alma
   * </code></pre>
   * @param {ModelInterface} model - The model to mount the operator to.
   * @param {*[]} path  - The path (list of keys) in the model data to mount the operator to.
   * @param {OperatorInterface} [parentOp] - The op that is responsible for this operator.
   */
  mount (model, path, parentOp) { throw new Error('Not Yet Implemented') }

  /**
   * Nests an operator within this one.
   * @param {OperatorInterface} op - The operator to add.
   */
  addNestedOp (op) { throw new Error('Not Yet Implemented') }

  /**
   * Removes an op that was nested in this one.
   * @param {OperatorInterface} op - The operator to add.
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
   * This will typically be:<pre><code>
   * return (this.path || []).concat(relative)
   * </code></pre>
   * ...where this.path is the instance variable storing the operator's path.
   * @param  {...any} relative - Relative path to the target.
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
   * @param {OperatorInterface} sourceOperator - The operator that initiated the change.
   * @param {string} - The action the data is coming from.
   */
  consider (data, sourceOperator, actionName) { throw new Error('Not Yet Implemented') }

  /**
   * Optional. Called to allow the operator to automatically trigger actions after an action has been processed.
   */
  // nextAction () { throw new Error('Not Yet Implemented') // }
}
