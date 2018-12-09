export class ActionProcessorInterface {
  /**
   *
   * @param {OperativeInterface} operative - The operative to get the proposal for.
   * @param {ModelInterface} model - The model that will consider the proposal.
   * @param {Object} [args={}]
   */
  getProposal (operative, model, args = {}) { throw new Error('Not Yet Implemented') }

  /**
   *
   * @param {OperativeInterface} operative - The operative the proposal is from.
   * @param {ModelInterface} model - The model considering the proposal.
   * @param {Object} proposal - The proposed changes to the model.
   */
  digest (operative, model, proposal) { throw new Error('Not Yet Implemented') }
}
