import { mount } from './functions/mount'
import { NormalMutator } from './adapters/NormalMutator'
import { defaults } from './functions/defaults';

const normalMutatorSingleton = new NormalMutator()

/**
 * Base class for operators.
 * @class
 */
export class AbstractOperator {
  mount (model, path) {
    /**
     * @type {ModelInstance}
     */
    this.model = model
    /**
     * @type {*[]}
     */
    this.path = path
    mount(this, this.model, this.path)
  }

  getPath (...relative) { return (this.path || []).concat(relative) }

  /**
   * Helper method for getting model data.
   * @param {*[]} relative  - The relative path (list of keys) to pull the value from.
   * @param {ActionProcessorInterface} actionProcessorForDefaults - The action processor to pull defaults from if
   *  the actual value turns out to be undefined.
   */
  getModelData (relative, actionProcessorForDefaults = void 0) {
    let data = this.model.get(this.getPath(...relative))
    if (typeof data === 'undefined' && actionProcessorForDefaults) {
      data = normalMutatorSingleton.get(defaults(this, this.model, actionProcessorForDefaults), relative)
    }
    return data
  }
}
