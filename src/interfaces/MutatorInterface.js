/**
 * @interface
 */
export class MutatorInterface {
  /**
   * Gets a value from an object.
   * @param {Object} obj - The object to get the value from.
   * @param {*[]} path  - The path (list of keys) to pull the value from.
   * @param {*} [defaultValue=undefined] - The value to return if it is not defined.
   * @returns {*} the value on the path, or the default value if it was not defined.
   */
  get (obj, path, defaultValue = void 0) { throw new Error('Not Yet Implemented') }

  /**
   * Sets a value on an object.
   * @param {Object} obj - The object to set the value on.
   * @param {*[]} path  - The path (list of keys) to set the value on.
   * @param {*} value - The value to set on the object.
   * @returns {Object} an object with the value set.
   */
  set (obj, path, value) { throw new Error('Not Yet Implemented') }

  /**
   * Deletes a property from an object.
   * @param {Object} obj - The object to set the value on.
   * @param {*[]} path  - The path (list of keys) of the property to delete.
   * @returns {Object} an object with the property deleted.
   */
  delete (obj, path) { throw new Error('Not Yet Implemented') }
}
