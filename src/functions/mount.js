import { NormalMutator } from '../adapters/NormalMutator'

/**
 * @type {MutatorInterface}
 */
const normalMutator = new NormalMutator()

/**
 * Mounts an operator into a model.
 * @param {OperatorInterface} op - The operator to mount.
 * @param {ModelInterface} model - The model the operator will be mounted in.
 * @param {*[]} path  - The path (list of keys) on the model data that represent the operator.
 * @param {OperatorInterface} [parentOp] - The op that is responsible for the one being mounted.
 */
export function mount (op, model, path, parentOp) {
  if (parentOp) {
    parentOp.addNestedOp(op)
  } else {
    model.opTree = normalMutator.set(model.opTree, path, op)
  }
}
