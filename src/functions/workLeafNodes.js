import isPlainObject from 'is-plain-object'

/**
 * Calls a callback function on all leaf nodes in a tree. The order in which the nodes are worked is not guaranteed.
 * @param {Object} tree - The object to work.
 * @param {Function} callback - The callback function. It is called as:
 *  callback({*[]} path - list of keys to get to the node, {*} node)
 * @param {Function} [isLeaf] - A function that test whether or not a node is a leaf node.
 *  The default implementation returns true for all nodes that are not plain Javascript objects. It is called as:
 *  isLeaf({*[]} path - list of keys to get to the node, {*} node)
 */
export function workLeafNodes (tree, callback, isLeaf = defaultIsLeaf) {
  if (isLeaf([], tree)) {
    return
  }
  recurse(tree, callback, [], isLeaf)
}

/**
 * Calls a callback function on all leaf nodes in a tree. The order in which the nodes are worked is not guaranteed.
 * @param {Object} tree - The object to work.
 * @param {Function} callback - The callback function. It is called as:
 *  callback({*[]} path - list of keys to get to the node, {*} node)
 * @param {*[]} path - The current path of recursion.
 * @param {Function} isLeaf - A function that test whether or not a node is a leaf node.
 */
function recurse (tree, callback, path, isLeaf) {
  if (typeof tree === 'undefined') {
    return
  }

  for (const key of Object.getOwnPropertyNames(tree).concat(Object.getOwnPropertySymbols(tree))) {
    const node = tree[key]
    const nodePath = path.concat(key)
    if (isLeaf(nodePath, node)) {
      callback(nodePath, node)
    } else {
      recurse(node, callback, nodePath, isLeaf)
    }
  }
}

/**
 * Returns whether or not the node is considered a leaf node.
 * @param {*[]} path - The path to the node.
 * @param {*} node - The node in question.
 * @returns {boolean}
 */
function defaultIsLeaf (path, node) {
  return !isPlainObject(node)
}
