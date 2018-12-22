/**
 * @class
 * @implements {PresenterInterface}
 */
export class TestPresenter {
  /**
   * @ignore
   */
  constructor () {
    /**
     * The model data, passed through, for unit testing.
     * @public
     * @type {*}
     */
    this.state = void 0
  }

  /**
   * Gets a representation of the model.
   * @param {ModelInterface} model
   * @returns {*} A reprsentation of the model that the presenter understands.
   */
  getRepresentation (model) {
    return model.data
  }

  /**
   * Renders a representation of the model.
   * @param {mixed} representation The representation of the model to be consumed by the view.
   */
  render (representation) {
    this.state = representation
  }
}
