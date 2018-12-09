export class OperativeInterface {
  /**
   * Mounts an operative to the model.
   *
   * This will typically be:<pre><code>
   * this.model = model
   * this.path = path
   * mount(this, this.model, this.path) // mount helper function, imported from alma
   * </code></pre>
   * @param {ModelInterface} model - The model to mount the operative to.
   * @param {*[]} path  - The path (list of keys) in the model data to mount the operative to.
   */
  mount (model, path) { throw new Error('Not Yet Implemented') }

  /**
   * Gets the path to model data, relative to the operative's path.
   *
   * This will typically be:<pre><code>
   * return (this.path || []).concat(relative)
   * </code></pre>
   * ...where this.path is the instance variable storing the operative's path.
   * @param  {...any} relative - Relative path to the target.
   */
  getPath (...relative) { throw new Error('Not Yet Implemented') }

  /**
   * Resets the operative.
   *
   * This will typically call all actions with default parameters and call reset on any nested operatives.
   */
  reset () { throw new Error('Not Yet Implemented') }

  /**
   * Optional. Called to allow the operative to automatically trigger actions after an action has been processed.
   */
  // nextAction () { throw new Error('Not Yet Implemented') // }
}
