/**
 * A simple, normal mutator.
 * @class
 * @implements {MutatorInterface}
 */
export class NormalMutator {
  /**
   * Gets a value from an object.
   * @param {Object} obj - The object to get the value from.
   * @param {*[]} path  - The path (list of keys) to pull the value from.
   * @param {*} [defaultValue=undefined] - The value to return if it is not defined.
   * @returns {*} the value on the path, or the default value if it was not defined.
   */
  get (obj, path, defaultValue = void 0) {
    let result = obj
    const arrayPath = path ? [].concat(path) : []
    if (arrayPath.length === 0) {
      return obj
    }

    const lastKey = arrayPath.pop()

    while (arrayPath.length > 0) {
      const key = arrayPath.shift()
      result = result[key]
      if (typeof result === 'undefined' || !(result instanceof Object)) {
        return defaultValue
      }
    }
    return typeof result[lastKey] === 'undefined'
      ? defaultValue
      : result[lastKey]
  }

  /**
   * Sets a value on an object.
   * @param {Object} obj - The object to set the value on.
   * @param {*[]} path  - The path (list of keys) to set the value on.
   * @param {*} value - The value to set on the object.
   * @returns {Object} an object with the value set.
   */
  set (obj, path, value) {
    let container = obj
    const arrayPath = path ? [].concat(path) : []
    if (arrayPath.length === 0) {
      return value
    }
    const lastKey = arrayPath.pop()

    while (arrayPath.length > 0) {
      const key = arrayPath.shift()
      let nextContainer = container[key]
      if (typeof nextContainer === 'undefined' || !(nextContainer instanceof Object)) {
        container[key] = {}
        nextContainer = container[key]
      }
      container = nextContainer
    }

    container[lastKey] = value

    return obj
  }

  /**
   * Deletes a property from an object.
   * @param {Object} obj - The object to set the value on.
   * @param {*[]} path  - The path (list of keys) of the property to delete.
   * @returns {Object} an object with the property deleted.
   */
  delete (obj, path) {
    let container = obj
    const arrayPath = path ? [].concat(path) : []
    if (arrayPath.length === 0) {
      return
    }
    const lastKey = arrayPath.pop()

    while (arrayPath.length > 0) {
      const key = arrayPath.shift()
      let nextContainer = container[key]
      if (typeof nextContainer === 'undefined' || !(nextContainer instanceof Object)) {
        return obj
      }
      container = nextContainer
    }

    delete container[lastKey]

    return obj
  }
}
