import { NormalMutator } from '../adapters/NormalMutator'

const normalMutator = new NormalMutator()

/**
 * Mounts an operator into a model.
 * @param {OperatorInterface} op - The operator to mount.
 * @param {ModelInterface} model - The model the operator will be mounted in.
 * @param {*[]} path  - The path (list of keys) on the model data that represent the operator.
 */
export function mount (op, model, path) {
  model.opTree = normalMutator.set(model.opTree, path, op)
  return op
}
