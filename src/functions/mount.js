import { NormalMutator } from '../adapters/NormalMutator'

const normalMutator = new NormalMutator()

/**
 * Mounts an operative into a model.
 * @param {OperativeInterface} op - The operative to mount.
 * @param {ModelInterface} model - The model the operative will be mounted in.
 * @param {*[]} path  - The path (list of keys) on the model data that represent the operative.
 */
export function mount (op, model, path) {
  model.opTree = normalMutator.set(model.opTree, path, op)
  return op
}
