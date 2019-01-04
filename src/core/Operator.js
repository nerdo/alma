import { NormalMutator } from '../adapters/NormalMutator'
import { UnmountedOperatorError } from './UnmountedOperatorError'

/**
 * @type {MutatorInterface}
 */
const normalMutatorSingleton = new NormalMutator()

/**
 * @type {WeakMap}
 */
const cachedSelectors = new WeakMap()

/**
 * @type {WeakMap}
 */
const cachedIntentions = new WeakMap()

/**
 * @type {Object}
 */
const EMPTY_OBJECT = Object.freeze({})

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
   * Gets a unique name for all instances of the operation.
   * @returns {string}
   */
  getOpName () {
    const opNameKey = Symbol.for('getOpName')
    if (!this[opNameKey]) {
      this[opNameKey] = Object.getPrototypeOf(this).constructor.name
    }
    return this[opNameKey]
  }

  /**
   * Gets an object containing selectors (functions) that retrieve data from the op.
   * @returns {Object.<string, Function>}
   */
  getSelectors () {
    return this.makeSelectors()
  }

  /**
   * Resets the operator.
   *
   * This will typically call all actions with default parameters and call reset on any nested operators.
   */
  reset () {
    // Empty implementation, making reset() optional to implement.
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
   * Unmounts an operator and any nested operators from the model.
   * After this function call is completed:
   *  The operator should no longer be in the optree at its specified path.
   *  The operators data should no longer be present in the model.
   */
  unmount () {
    if (!this.model) {
      return
    }

    // Unmount nested children first.
    if (this.nestedOps) {
      for (const [op] of this.nestedOps) {
        op.unmount()
      }
    }

    this.model.setOpTree(normalMutatorSingleton.delete(this.model.getOpTree(), this.path))
    this.deleteModelData([])
    this.path = void 0
    this.model = void 0
  }

  /**
   * Nests an operator within this one.
   * @param {OperatorInterface} op - The operator to add.
   * @param {*[]} relativePath - The path it should be mounted on, relative to the current op.
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
    op.unmount()
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
    return (this.path || [])
      .concat(relative)
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
   * @throws {UnmountedOperatorError}
   */
  getModelData (relative, defaultValue = void 0) {
    if (!this.model) {
      throw new UnmountedOperatorError(this)
    }
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
   * @throws {UnmountedOperatorError}
   */
  setModelData (relative, value) {
    if (!this.model) {
      throw new UnmountedOperatorError(this)
    }
    this.model.set(this.getPath(...[].concat(relative)), value)
  }

  /**
   * Helper method for deleting model data.
   * @param {*[]} relative  - The relative path (list of keys) to set the value on.
   * @throws {UnmountedOperatorError}
   */
  deleteModelData (relative) {
    if (!this.model) {
      throw new UnmountedOperatorError(this)
    }
    this.model.delete(this.getPath(...[].concat(relative)))
  }

  /**
   * Gets whether or not the path is on the operator's path.
   * @param {Array} path
   * @returns {boolean}
   */
  pathBelongsToOp (path) {
    return this.path
      ? this.path
        .map((part, index) => `${part}` === `${path[index]}`)
        .reduce(
          (result, current) => result && current,
          true
        )
      : false
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
   * @throws {UnmountedOperatorError}
   */
  propose (action, data, isDataRelative = true) {
    if (!this.model) {
      throw new UnmountedOperatorError(this)
    }
    const realAction = typeof action === 'string' ? { name: action } : action
    this.model.consider(
      isDataRelative
        ? this.getAbsoluteChange(data)
        : data,
      this,
      realAction
    )
  }

  /**
   * Makes and returns an object containing selectors.
   * @param  {...Function} functions - Selector functions.
   * @returns {Object.<string, Function>}
   */
  makeSelectors (...functions) {
    if (!cachedSelectors.has(this) && functions.length) {
      const selectors = {}

      for (const f of functions) {
        selectors[f.name] = (...args) => Reflect.apply(f, this, args)
      }

      cachedSelectors.set(this, selectors)
    }

    return cachedSelectors.get(this) || EMPTY_OBJECT
  }

  /**
   * Makes and returns an object containing intentions.
   * @param  {...Function} functions - Intention functions.
   * @returns {Object.<string, Function>}
   */
  makeIntentions (...functions) {
    if (!cachedIntentions.has(this) && functions.length) {
      const intentions = {}

      for (const f of functions) {
        intentions[f.name] = (...args) => Reflect.apply(f, this, args)
      }

      cachedIntentions.set(this, intentions)
    }

    return cachedIntentions.get(this) || EMPTY_OBJECT
  }
}
