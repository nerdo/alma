import { Supervisor } from './Supervisor'
import { Model } from './Model'

export class Engine {
  /**
   * Creates an engine which wires together a presenter, supervisor, and model.
   * @param {PresenterInterface} presenter - The presenter the engine will be wired to.
   * @param {ModelInterface} [model=new Model()] - The model the engine will be wired to.
   * @param {SupervisorInterface} [supervisor=new Supervisor()] - The supervisor the engine will be wired to.
   */
  constructor (presenter, model = new Model(), supervisor = new Supervisor()) {
    this.setPresenter(presenter)
    this.setSupervisor(supervisor)
    this.setModel(model)
  }

  /**
   * Sets the presenter.
   * @param {PresenterInterface} presenter
   */
  setPresenter (presenter) {
    this.presenter = presenter
  }

  /**
   * Sets the supervisor.
   * @param {SupervisorInterface} supervisor
   */
  setSupervisor (supervisor) {
    this.supervisor = supervisor
  }

  /**
   * Sets the model.
   * @param {ModelInterface} model
   */
  setModel (model) {
    this.model = model
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
   */
  reset () {
    this.initialize()
    this.model.reset()
  }

  /**
   * Starts the engine.
   */
  start () {
    this.initialize()
    this.supervisor.process(this.model)
  }

  initialize () {
    this.supervisor.setPresenter(this.presenter)
    this.model.setSupervisor(this.supervisor)
  }
}
