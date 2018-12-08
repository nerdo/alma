export class TestPresenter {
  getRepresentation (model) {
    return model.data
  }

  render (representation) {
    this.state = representation
  }
}
