import { TestPresenter } from '../adapters/TestPresenter'
import { Engine } from '../Engine'

export function TestEngine (opTree = {}) {
  const engine = new Engine(new TestPresenter())
  const model = engine.getModel()
  model.setOpTree(opTree)
  engine.start()
  return engine
}

TestEngine.start = function (opTree) {
  return new TestEngine(opTree)
}
