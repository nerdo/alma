import isPlainObject from 'is-plain-object'

/**
 * Calls a callback function on all leaf nodes in a tree. The order in which the nodes are worked is not guaranteed.
 * @param {Object} tree - The object to work.
 * @param {Function} callback - The callback function. It is called as:
 *  callback({*[]} path - list of keys to get to the node, {*} node)
 */
export function workLeafNodes (tree, callback) {
  recurse(tree, callback, [])
}

function recurse (tree, callback, path) {
  if (typeof tree === 'undefined') {
    return
  }

  for (const key of Object.getOwnPropertyNames(tree).concat(Object.getOwnPropertySymbols(tree))) {
    const node = tree[key]
    if (isLeaf(node)) {
      callback(path.concat(key), node)
    } else {
      recurse(node, callback, path.concat(key))
    }
  }
}

function isLeaf (node) {
  return !isPlainObject(node)
}
