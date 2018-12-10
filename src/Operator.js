import { mount } from './functions/mount'
import { NormalMutator } from './adapters/NormalMutator'
import { defaults } from './functions/defaults';

const normalMutatorSingleton = new NormalMutator()

/**
 * Base class for operators.
 * @class
 */
export class Operator {
  mount (model, path, parentOp) {
    /**
     * @type {ModelInstance}
     */
    this.model = model
    /**
     * @type {*[]}
     */
    this.path = path
    mount(this, this.model, this.path, parentOp)
  }

  /**
   * Nests an operator within this one.
   * @param {OperatorInterface} op - The operator to add.
   */
  addNestedOp (op) {
    this.nestedOps = this.nestedOps || new Set()
    this.nestedOps.add(op)
  }

  /**
   * Removes an op that was nested in this one.
   * @param {OperatorInterface} op - The operator to add.
   */
  removeNestedOp (op) {
    if (!this.nestedOps) { return }
    this.nestedOps.delete(op)
  }

  /**
   * Gets a list of operators nested within this one.
   * @returns {[OperatorInterface]}
   */
  getNestedOps () {
    return this.nestedOps
      ? Array.from(this.nestedOps)
      : []
  }

  getPath (...relative) { return (this.path || []).concat(relative) }

  /**
   * Helper method for getting model data.
   * @param {*[]} relative  - The relative path (list of keys) to pull the value from.
   * @param {ActionProcessorInterface} actionProcessorForDefaults - The action processor to pull defaults from if
   *  the actual value turns out to be undefined.
   */
  getModelData (relative, actionProcessorForDefaults = void 0) {
    if (!this.model) { return void 0 }
    let data = this.model.get(this.getPath(...relative))
    if (typeof data === 'undefined' && actionProcessorForDefaults) {
      data = normalMutatorSingleton.get(defaults(this, this.model, actionProcessorForDefaults), relative)
    }
    return data
  }

  pathBelongsToOp (path) {
    return (this.path || [])
      .map((part, index) => `${part}` === `${path[index]}`)
      .reduce(
        (result, current) => result && current,
        true
      )
  }
}
