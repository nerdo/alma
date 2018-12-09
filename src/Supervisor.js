export class Supervisor {
  /**
   * Sets the presenter.
   * @param {PresenterInterface} presenter
   * @returns {SupervisorInterface} this
   */
  setPresenter (presenter) {
    this.presenter = presenter
    return this
  }

  /**
   * Gets the presenter.
   * @returns {PresenterInterface}
   */
  getPresenter () {
    return this.presenter
  }

  /**
   * Sets the function called when nextAction is invoked.
   * @param {Function} before - Called before operative next actions.
   * @param {Function} after - Called after operative next actions.
   * @returns {SupervisorInterface} this
   */
  setNextActionDelegates (before, after) {
    this.nextActionDelegateBefore = before
    this.nextActionDelegateAfter = after
    return this
  }

  /**
   * Gets the function(s) called when nextAction is invokekd.
   * @returns {[Function, Function]} - A tuple of the before and after delegate functions.
   */
  getNextActionDelegates () {
    return [this.nextActionDelegateBefore, this.nextActionDelegateAfter]
  }

  /**
   * Processes the model.
   * @param {ModelInterface} model
   */
  process (model) {
    this.digest(model)
    this.nextAction(model)
  }

  /**
   * Digests the model to be consumed by PresenterInterface.render().
   * @param {ModelInterface} model
   */
  digest (model) {
    const representation = this.presenter.getRepresentation(model)
    this.presenter.render(representation)
  }

  /**
   * Triggers actions after the model is digested.
   * @param {ModelInterface} model
   */
  nextAction (model) {
    const [beforeOps, afterOps] = this.getNextActionDelegates()

    if (beforeOps) {
      this.beforeOps(model)
    }

    // Allow operatives to tap into next actions through the model.
    model.nextAction()

    if (afterOps) {
      this.afterOps(model)
    }
  }
}
