/**
 * @interface
 */
export class PresenterInterface {
  /**
   * Gets a representation of the model.
   * @param {ModelInterface} model
   * @returns {*} A reprsentation of the model that the presenter understands.
   */
  getRepresentation (model) { throw new Error('Not Yet Implemented') }

  /**
   * Renders a representation of the model.
   * @param {mixed} representation The representation of the model to be consumed by the view.
   */
  render (representation) { throw new Error('Not Yet Implemented') }
}
