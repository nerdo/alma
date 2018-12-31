/**
 * Traverses a tree and calls the callback function on each node.
 * @param {*} tree - The tree to traverse.
 * @param {*} callback - The callback function. It is called as:
 *  callback({*} node, {*[]} path - List of keys to get to the node)
 * @param {Object} [options] - Options for tree traversal.
 * @param {Function} [options.getChildren] - A function that returns children for a node. It is called as:
 *  getChildren({*} node, {*[]} path - List of keys to get to the node)
 *  ...and it should return an array of objects with the keys:
 *  {*} node - The child node.
 *  {*[]} path - List of keys to get to the node
 *  The default (defaultGetChildren) function returns the children for non-scalar nodes.
 * @param {boolean} [options.traverseLeavesFirst=false]
 */
export function traverse (
  tree,
  callback,
  {
    getChildren = defaultGetChildren,
    traverseLeavesFirst = false
  } = {}) {
  recurse(tree, callback, [], getChildren, traverseLeavesFirst, new WeakMap())
}

/**
 * Default getChildren used by {@link traverse}.
 * @param {*} node - The node to get the children for.
 * @param {*} path - The path to the node.
 */
export function defaultGetChildren (node, path) {
  if (isScalar(node)) {
    return []
  }

  const children = []
  for (const [key, child] of Object.entries(node)) {
    children.push({
      path: path.concat(key),
      node: child
    })
  }

  return children
}

function recurse (tree, callback, path, getChildren, traverseLeavesFirst, recursed) {
  if (typeof tree === 'undefined' || tree === null) {
    return
  }

  const isTreeScalar = isScalar(tree)

  if (!traverseLeavesFirst) {
    process(tree, path, callback)
  }

  let children = []

  if (!isTreeScalar) {
    for (const [key, node] of Object.entries(tree)) {
      const currentPath = path.concat(key)
      if (!traverseLeavesFirst) {
        process(node, currentPath, callback)
      }

      children = children.concat(getChildren(node, currentPath))

      // Set flag that node was recursed to avoid cycles.
      if (!recursed.get(node) && !isScalar(node)) {
        recursed.set(node, true)
      }
    }
  }

  // Only recurse on nodes that haven't already been processed.
  for (const child of children) {
    if (!recursed.get(child.node)) {
      recurse(child.node, callback, child.path, getChildren, traverseLeavesFirst, recursed)
    }
  }

  if (traverseLeavesFirst) {
    if (!isTreeScalar) {
      for (const [key, node] of Object.entries(tree)) {
        process(node, path.concat(key), callback)
      }
    }

    process(tree, path, callback)
  }
}

function process (node, path, callback) {
  callback(node, path)
}

function isScalar (value) {
  return value === null || typeof value !== 'object'
}
