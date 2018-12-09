export class EngineInterface {
  /**
   * Sets the presenter.
   * @param {PresenterInterface} presenter
   * @returns {EngineInterface} this
   */
  setPresenter (presenter) { throw new Error('Not Yet Implemented') }

  /**
   * Sets the supervisor.
   * @param {SupervisorInterface} supervisor
   * @returns {EngineInterface} this
   */
  setSupervisor (supervisor) { throw new Error('Not Yet Implemented') }

  /**
   * Sets the model.
   * @param {ModelInterface} model
   * @returns {EngineInterface} this
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
   * @param {Object} [data=undefined] - Data to reset the engine's model with.
   * @returns {EngineInterface} this
   */
  reset (data = {}) { throw new Error('Not Yet Implemented') }

  /**
   * Starts the engine.
   * @returns {EngineInterface} this
   */
  start () { throw new Error('Not Yet Implemented') }
}
