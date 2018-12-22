import { Supervisor } from './Supervisor'
import { Model } from './Model'

/**
 * A SAM engine.
 * @class
 * @implements {EngineInterface}
 */
export class Engine {
  /**
   * Creates an engine which wires together a presenter, supervisor, and model.
   * @param {PresenterInterface} presenter - The presenter the engine will be wired to.
   * @param {ModelInterface} [model=new Model()] - The model the engine will be wired to.
   * @param {SupervisorInterface} [supervisor=new Supervisor()] - The supervisor the engine will be wired to.
   */
  constructor (presenter, model = new Model(), supervisor = new Supervisor()) {
    /**
     * @private
     * @type {PresenterInterface}
     */
    this.presenter = void 0

    /**
     * @private
     * @type {ModelInterface}
     */
    this.model = void 0

    /**
     * @private
     * @type {SupervisorInterface}
     */
    this.supervisor = void 0

    this.setPresenter(presenter)
    this.setSupervisor(supervisor)
    this.setModel(model)
  }

  /**
   * Sets the presenter.
   * @param {PresenterInterface} presenter
   * @returns {EngineInterface} this
   */
  setPresenter (presenter) {
    this.presenter = presenter
    return this
  }

  /**
   * Sets the supervisor.
   * @param {SupervisorInterface} supervisor
   * @returns {EngineInterface} this
   */
  setSupervisor (supervisor) {
    this.supervisor = supervisor
    return this
  }

  /**
   * Sets the model.
   * @param {ModelInterface} model
   * @returns {EngineInterface} this
   */
  setModel (model) {
    this.model = model
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
   * Gets the supervisor.
   * @returns {SupervisorInterface}
   */
  getSupervisor () {
    return this.supervisor
  }

  /**
   * Gets the model.
   * @returns {ModelInterface}
   */
  getModel () {
    return this.model
  }

  /**
   * Resets the engine.
   * @param {Object} [data={}] - Data to reset the engine's model with.
   * @returns {EngineInterface} this
   */
  reset (data = {}) {
    this.initialize()
    this.model.reset(data)
    return this
  }

  /**
   * Starts the engine.
   * @returns {EngineInterface} this
   */
  start () {
    this.initialize()
    this.supervisor.process(this.model, Engine.START_ACTION)
    return this
  }

  /**
   * @private
   */
  initialize () {
    this.supervisor.setPresenter(this.presenter)
    this.model.setSupervisor(this.supervisor)
  }
}

/**
 * @type {Object}
 */
Engine.START_ACTION = { name: '$ENGINE-START$' }
