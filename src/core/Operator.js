import { NormalMutator } from '../adapters/NormalMutator'

/**
 * @type {MutatorInterface}
 */
const normalMutatorSingleton = new NormalMutator()

/**
 * A base class for operators.
 * @class
 * @implements {OperatorInterface}
 */
export class Operator {
  /**
   * @ignore
   */
  constructor () {
    /**
     * @type {ModelInterface}
     * @private
     */
    this.model = void 0

    /**
     * @type {*[]}
     * @private
     */
    this.path = void 0

    /**
     * @type {Set<OperatorInterface>}
     * @private
     */
    this.nestedOps = void 0
  }

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
  mount (model, path, parentOp) {
    this.model = model
    this.path = path
    if (parentOp) {
      const relativePath = path.slice(parentOp.getPath().length)
      parentOp.addNestedOp(this, relativePath)
    } else {
      model.setOpTree(normalMutatorSingleton.set(model.getOpTree(), this.path, this))
    }

    if (this.nestedOps) {
      for (const [op, nestedPath] of this.nestedOps) {
        op.mount(model, this.getPath(...(nestedPath || [])), this)
      }
    }
  }

  /**
   * Nests an operator within this one.
   * @param {OperatorInterface} op - The operator to add.
   * @param {*[]} relativePath - Te path it should be mounted on, relative to the current op.
   */
  addNestedOp (op, relativePath) {
    this.nestedOps = this.nestedOps || new Map()
    this.nestedOps.set(op, relativePath)

    if (this.model) {
      op.mount(this.model, this.getPath(...(relativePath || [])))
    }
  }

  /**
   * Removes an op that was nested in this one.
   * @param {OperatorInterface} op - The operator to add.
   */
  removeNestedOp (op) {
    if (!this.nestedOps) { return }
    // TODO call a lifecycle function, e.g. unmounting() on the op, if it exists.
    this.nestedOps.delete(op)
  }

  /**
   * Gets a list of operators nested within this one.
   * @returns {[OperatorInterface]}
   */
  getNestedOps () {
    return this.nestedOps
      ? Array.from(this.nestedOps.keys())
      : []
  }

  /**
   * Gets the path to model data, relative to the operator's path.
   *
   * This will typically be:<pre><code>return (this.path || []).concat(relative)</code></pre>
   * ...where this.path is the instance variable storing the operator's path.
   * @param  {...any} relative - Relative path to the target.
   * @returns {*[]}
   */
  getPath (...relative) {
    return (this.path || []).concat(relative)
  }

  /**
   * Gets the model this op is mounted in.
   * @returns {ModelInterface}
   */
  getModel () {
    return this.model
  }

  /**
   * Helper method for getting model data.
   * @param {*[]} relative  - The relative path (list of keys) to pull the value from.
   * @param {*} defaultValue - The value to return if the model data is undefined.
   */
  getModelData (relative, defaultValue = void 0) {
    if (!this.model) { return void 0 }
    let data = this.model.get(this.getPath(...relative))
    if (typeof data === 'undefined') {
      data = defaultValue
    }
    return data
  }

  /**
   * Helper method for seting model data.
   * @param {*[]} relative  - The relative path (list of keys) to set the value on.
   * @param {*} value - The value to set.
   */
  setModelData (relative, value) {
    if (!this.model) { return }
    this.model.set(this.getPath([].concat(relative)), value)
  }

  /**
   * Gets whether or not the path is on the operator's path.
   * @param {Array} path
   * @returns {boolean}
   */
  pathBelongsToOp (path) {
    return (this.path || [])
      .map((part, index) => `${part}` === `${path[index]}`)
      .reduce(
        (result, current) => result && current,
        true
      )
  }

  /**
   * Returns an object that represents the change that can be applied to the model from the root.
   * @param {*} data - The data, relative to the operator.
   * @return {Object}
   */
  getAbsoluteChange (data) {
    const change = {}
    let current = change
    const path = [].concat(this.getPath())
    const lastKey = path.pop()
    for (const key of path) {
      current[key] = {}
      current = current[key]
    }
    current[lastKey] = data
    return change
  }

  /**
   * Gets the slice of data that belongs to the operator.
   * @param {*} data The model data.
   * @returns {*}
   */
  getRelativeSlice (data) {
    return normalMutatorSingleton.get(data, this.getPath())
  }

  /**
   * Proposes a change to the model.
   * @param {string|Object} action - the action being prooposed.
   * @param {string} action.name - The name of the action being proposed.
   * @param {Object} action.context - Contextual information for the action.
   * @param {*} data - The data to propose to the model.
   * @param {boolean} isDataRelative - Whether or not the data is relative to the current operator.
   */
  propose (action, data, isDataRelative = true) {
    const realAction = typeof action === 'string' ? { name: action } : action
    this.model.consider(
      isDataRelative
        ? this.getAbsoluteChange(data)
        : data,
      this,
      realAction
    )
  }
}