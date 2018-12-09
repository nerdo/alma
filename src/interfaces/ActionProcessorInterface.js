export class ActionProcessorInterface {
  /**
   *
   * @param {OperatorInterface} operator - The operator to get the proposal for.
   * @param {ModelInterface} model - The model that will consider the proposal.
   * @param {Object} [args={}]
   */
  getProposal (operator, model, args = {}) { throw new Error('Not Yet Implemented') }

  /**
   *
   * @param {OperatorInterface} operator - The operator the proposal is from.
   * @param {ModelInterface} model - The model considering the proposal.
   * @param {Object} proposal - The proposed changes to the model.
   */
  digest (operator, model, proposal) { throw new Error('Not Yet Implemented') }
}
