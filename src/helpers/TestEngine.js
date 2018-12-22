import { TestPresenter } from '../adapters/TestPresenter'
import { Engine } from '../Engine'

export function TestEngine (opTree = {}, data = {}) {
  const engine = new Engine(new TestPresenter())
  const model = engine.getModel()
  model.set([], data)
  model.setOpTree(opTree)
  engine.start()
  return engine
}

TestEngine.start = function (opTree, data) {
  return new TestEngine(opTree, data)
}
