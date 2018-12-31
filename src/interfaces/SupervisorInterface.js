/**
 * @interface
 */
export class SupervisorInterface {
  /**
   * Sets the presenter.
   * @param {PresenterInterface} presenter
   * @returns {SupervisorInterface} this
   */
  setPresenter (presenter) { throw new Error('Not Yet Implemented') }

  /**
   * Gets the presenter.
   * @returns {PresenterInterface}
   */
  getPresenter () { throw new Error('Not Yet Implemented') }

  /**
   * Sets the function called when postProcess is invoked.
   * @param {Function} before - Called before operator next actions.
   * @param {Function} after - Called after operator next actions.
   * @returns {SupervisorInterface} this
   */
  setNextActionDelegates (before, after) { throw new Error('Not Yet Implemented') }

  /**
   * Gets the function(s) called when postProcess is invoked.
   * @returns {[Function, Function]} - A tuple of the before and after delegate functions.
   */
  getNextActionDelegates () { throw new Error('Not Yet Implemented') }

  /**
   * Processes the model.
   * @param {ModelInterface} model
   * @param {OperatorInterface} sourceOperator - The operator that proposed the action.
   * @param {Object} action - The proposed action.
   * @param {string} action.name - The name of the action.
   * @param {Object} [action.context] - Contextual information for the action.
   */
  process (model, sourceOperator, action) { throw new Error('Not Yet Implemented') }

  /**
   * Digests the model to be consumed by PresenterInterface.render().
   * @param {ModelInterface} model
   */
  digest (model) { throw new Error('Not Yet Implemented') }

  /**
   * Triggers actions after the model is digested.
   * @param {ModelInterface} model
   * @param {OperatorInterface} sourceOperator - The operator that proposed the action.
   * @param {Object} action - The proposed action.
   * @param {string} action.name - The name of the action.
   * @param {Object} [action.context] - Contextual information for the action.
   */
  postProcess (model, sourceOperator, action) { throw new Error('Not Yet Implemented') }
}
