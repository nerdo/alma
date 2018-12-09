/**
 * Triggers an action.
 * @param {OperatorInterface} op - The operator this action is being performed through.
 * @param {ModelInterface} model - The model the action will submit a proposal to.
 * @param {ActionProcessorInterface} processor - The action processor.
 * @param {Object} args - Structured arguments for the action.
 */
export function action (op, model, processor, args) {
  const proposal = processor.getProposal(op, model, args)
  processor.digest(op, model, proposal)
  model.getSupervisor().process(model)
}
