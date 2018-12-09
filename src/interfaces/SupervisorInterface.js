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
   * Sets the function called when nextAction is invoked.
   * @param {Function} before - Called before operator next actions.
   * @param {Function} after - Called after operator next actions.
   * @returns {SupervisorInterface} this
   */
  setNextActionDelegates (before, after) { throw new Error('Not Yet Implemented') }

  /**
   * Gets the function(s) called when nextAction is invokekd.
   * @returns {[Function, Function]} - A tuple of the before and after delegate functions.
   */
  getNextActionDelegates () { throw new Error('Not Yet Implemented') }

  /**
   * Processes the model.
   * @param {ModelInterface} model
   */
  process (model) { throw new Error('Not Yet Implemented') }

  /**
   * Digests the model to be consumed by PresenterInterface.render().
   * @param {ModelInterface} model
   */
  digest (model) { throw new Error('Not Yet Implemented') }

  /**
   * Triggers actions after the model is digested.
   * @param {ModelInterface} model
   */
  nextAction (model) { throw new Error('Not Yet Implemented') }
}
