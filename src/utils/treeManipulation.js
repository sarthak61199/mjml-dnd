import { v4 as uuidv4 } from "uuid";

// Helper function to deep clone an object or array
const deepClone = obj => {
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, deepClone(value)]));
  }
  return obj;
};

// Generate a new UUID for components using the uuid package
export const generateUuid = () => {
  return uuidv4();
};

// Create a deep clone of a component with new UUIDs for the component and all children
export const cloneComponentWithNewUuids = component => {
  const cloned = deepClone(component);

  // Generate new UUID for the component
  cloned.uuid = generateUuid();

  // Recursively update UUIDs for all children
  if (cloned.children && cloned.children.length > 0) {
    cloned.children = cloned.children.map(child => cloneComponentWithNewUuids(child));
  }

  return cloned;
};

// Helper function to get a component by uuid
export const findComponentByUuid = (tree, uuid) => {
  if (tree.uuid === uuid) {
    return { component: tree, path: [] };
  }

  if (tree.children?.length > 0) {
    for (let i = 0; i < tree.children.length; i++) {
      const result = findComponentByUuid(tree.children[i], uuid);
      if (result.component) {
        return {
          component: result.component,
          path: ["children", i, ...result.path],
        };
      }
    }
  }

  return { component: null, path: [] };
};

// Apply path to get to a specific node in the tree
const traversePath = (tree, path) => {
  if (!path.length) return { valid: true, target: tree };

  let current = tree;
  let parent = null;

  for (let i = 0; i < path.length - 2; i += 2) {
    const [key, index] = [path[i], path[i + 1]];
    if (!current[key]?.[index]) return { valid: false };
    current = current[key][index];
  }

  const lastKey = path[path.length - 2];
  const lastIndex = path[path.length - 1];

  return {
    valid: current[lastKey]?.[lastIndex] !== undefined,
    parent: current,
    lastKey,
    lastIndex,
    target: current[lastKey]?.[lastIndex],
  };
};

// Duplicate a component in the tree
export const duplicateComponentInTree = (tree, uuid) => {
  // Find the component by uuid
  const { component, path } = findComponentByUuid(tree, uuid);

  if (!component) {
    console.error("Component not found for duplication:", uuid);
    return tree;
  }

  // Create a duplicate with new UUIDs
  const duplicatedComponent = cloneComponentWithNewUuids(component);

  // Insert the duplicate after the original
  const newTree = deepClone(tree);
  const traverseResult = traversePath(newTree, path);

  if (!traverseResult.valid) {
    console.error("Invalid path for duplication:", path);
    return tree;
  }

  const { parent, lastKey, lastIndex } = traverseResult;

  // Insert the duplicate after the original component
  parent[lastKey].splice(lastIndex + 1, 0, duplicatedComponent);

  return newTree;
};

// Helper function to update a component in the tree
export const updateComponentInTree = (tree, path, updatedComponent) => {
  if (path.length === 0) {
    return updatedComponent || null;
  }

  const newTree = deepClone(tree);
  const traverseResult = traversePath(newTree, path);

  if (!traverseResult.valid) {
    console.error("Invalid path in updateComponentInTree:", path);
    return tree; // Return original tree if path is invalid
  }

  const { parent, lastKey, lastIndex } = traverseResult;

  if (updatedComponent === null) {
    // Remove the component
    parent[lastKey].splice(lastIndex, 1);
  } else {
    // Update the component
    parent[lastKey][lastIndex] = updatedComponent;
  }

  return newTree;
};

// Helper function to add a component to the tree
export const addComponentToTree = (tree, path, newComponent) => {
  // If path is empty, add to mj-body (for initial section drop)
  if (!path || path.length === 0) {
    const newTree = deepClone(tree);
    if (newTree.children?.[0]?.children) {
      newTree.children[0].children.push(newComponent);
    }
    return newTree;
  }

  // Special case for adding a section to an empty mj-body
  if (
    path.length === 3 &&
    path[0] === "children" &&
    path[2] === "children" &&
    tree.children?.[path[1]]
  ) {
    const newTree = deepClone(tree);
    newTree.children[path[1]].children.push(newComponent);
    return newTree;
  }

  // Regular case - add component at path
  const newTree = deepClone(tree);
  const traverseResult = traversePath(newTree, path);

  if (!traverseResult.valid) {
    console.error("Invalid path in addComponentToTree:", path);
    return tree;
  }

  const { target } = traverseResult;

  // Add to children array
  if (!target.children) {
    target.children = [];
  }
  target.children.push(newComponent);

  return newTree;
};

// Helper function to check if a component of type can be a child of a parent
export const canBeChild = (parentTagName, childType) => {
  const nestingRules = {
    "mj-column": [
      "mj-text",
      "mj-image",
      "mj-button",
      "mj-divider",
      "mj-spacer",
    ],
    "mj-section": ["mj-column"],
    "mj-body": ["mj-section"],
  };

  const allowedChildren = nestingRules[parentTagName] || [];
  return allowedChildren.includes(childType);
};

// Helper function to move a component in the tree
export const moveComponentInTree = (tree, fromPath, toPath) => {
  const newTree = deepClone(tree);

  // Extract component from source
  const fromTraverse = traversePath(newTree, fromPath);
  if (!fromTraverse.valid) {
    console.error("Invalid source path in moveComponentInTree:", fromPath);
    return tree;
  }

  const { parent: fromParent, lastKey: fromKey, lastIndex: fromIndex } = fromTraverse;
  const componentToMove = fromParent[fromKey][fromIndex];
  
  // Extract the target
  const toTraverse = traversePath(newTree, toPath);
  if (!toTraverse.valid) {
    console.error("Invalid target path in moveComponentInTree:", toPath);
    return tree;
  }

  const { target: toTarget, parent: toParent, lastKey: toKey, lastIndex: toIndex } = toTraverse;

  // Get the source and target parent paths
  const sourceParentPath = fromPath.slice(0, -2);
  const targetParentPath = toPath.slice(0, -2);
  
  // Check if we're reordering within the same parent
  const sameParent = JSON.stringify(sourceParentPath) === JSON.stringify(targetParentPath);
  
  // If moving between different parents, verify that the target parent can accept this component
  if (!sameParent) {
    const targetParentTraverse = traversePath(newTree, targetParentPath);
    if (!targetParentTraverse.valid || !targetParentTraverse.target) {
      console.error("Invalid target parent in moveComponentInTree");
      return tree;
    }
    
    const targetParent = targetParentTraverse.target;
    
    // Check if the component can be a child of the target parent
    if (!canBeChild(targetParent.tagName, componentToMove.tagName)) {
      console.error("Component cannot be a child of the target parent");
      return tree;
    }
  }
  
  // Now we can safely move the component
  fromParent[fromKey].splice(fromIndex, 1);
  
  // Recalculate the toIndex if it's the same parent and the removal affects the index
  let adjustedToIndex = toIndex;
  if (sameParent && fromIndex < toIndex) {
    adjustedToIndex--;
  }
  
  // Ensure we don't insert beyond the end of the array
  const safeIndex = Math.min(adjustedToIndex, toParent[toKey].length);
  toParent[toKey].splice(safeIndex, 0, componentToMove);

  return newTree;
};

// Helper function to find the parent section of a column
export const findParentSection = (tree, columnPath) => {
  if (!columnPath || columnPath.length < 4) return null;

  // To get the section path, we remove the last pair of entries (which point to the column)
  const sectionPath = columnPath.slice(0, -2);

  const traverseResult = traversePath(tree, sectionPath);
  if (!traverseResult.valid) return null;

  const { target } = traverseResult;

  // Check if the target is indeed a section
  if (target.tagName !== "mj-section") return null;

  return { section: target, path: sectionPath };
};

// Helper function to update vertical alignment for all columns in a section
export const updateVerticalAlignForSection = (tree, columnPath, verticalAlign) => {
  const parentResult = findParentSection(tree, columnPath);
  if (!parentResult) return tree;

  return updateComponentInTree(tree, parentResult.path, {
    ...parentResult.section,
    children: parentResult.section.children.map(column =>
      column.tagName === "mj-column"
        ? { ...column, attributes: { ...column.attributes, "vertical-align": verticalAlign } }
        : column
    ),
  });
};
