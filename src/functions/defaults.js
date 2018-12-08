/**
 * Gets defaults for an action.
 * @param {OperativeInterface} op - The operative the defaults are going through.
 * @param {ModelInterface} model - The model that may participate in generating defaults.
 * @param {ActionProcessorInterface} processor - The action processor used for actions.
 */
export function defaults (op, model, processor) {
  return processor.getProposal(op, model)
}
