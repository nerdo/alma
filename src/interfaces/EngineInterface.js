export class EngineInterface {
  /**
   * Sets the presenter.
   * @param {PresenterInterface} presenter
   */
  setPresenter (presenter) { throw new Error('Not Yet Implemented') }

  /**
   * Sets the supervisor.
   * @param {SupervisorInterface} supervisor
   */
  setSupervisor (supervisor) { throw new Error('Not Yet Implemented') }

  /**
   * Sets the model.
   * @param {ModelInterface} model
   */
  setModel (model) { throw new Error('Not Yet Implemented') }

  /**
   * Gets the presenter.
   * @returns {PresenterInterface}
   */
  getPresenter () { throw new Error('Not Yet Implemented') }

  /**
   * Gets the supervisor.
   * @returns {SupervisorInterface}
   */
  getSupervisor () { throw new Error('Not Yet Implemented') }

  /**
   * Gets the model.
   * @returns {ModelInterface}
   */
  getModel () { throw new Error('Not Yet Implemented') }

  /**
   * Resets the engine.
   */
  reset () { throw new Error('Not Yet Implemented') }

  /**
   * Starts the engine.
   */
  start () { throw new Error('Not Yet Implemented') }
}
