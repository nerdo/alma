export class OperatorInterface {
  /**
   * Mounts an operator to the model.
   *
   * This will typically be:<pre><code>
   * this.model = model
   * this.path = path
   * mount(this, this.model, this.path) // mount helper function, imported from alma
   * </code></pre>
   * @param {ModelInterface} model - The model to mount the operator to.
   * @param {*[]} path  - The path (list of keys) in the model data to mount the operator to.
   */
  mount (model, path) { throw new Error('Not Yet Implemented') }

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
   * Optional. Called to allow the operator to automatically trigger actions after an action has been processed.
   */
  // nextAction () { throw new Error('Not Yet Implemented') // }
}
