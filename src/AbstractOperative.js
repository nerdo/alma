import { mount } from './functions/mount'

/**
 * Base class for operatives.
 * @class
 */
export class AbstractOperative {
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
}
