export class NormalMutator {
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
}
