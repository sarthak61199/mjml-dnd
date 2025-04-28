import { findParentSection, updateComponentInTree } from "@/utils/treeManipulation";

// Helper function to check if a component of type can be a child of a parent
export const canBeChild = (parentTagName, childType) => {
  const nestingRules = {
    "mj-column": ["mj-text", "mj-image", "mj-button", "mj-divider", "mj-spacer"],
    "mj-section": ["mj-column"],
    "mj-body": ["mj-section"],
  };

  const allowedChildren = nestingRules[parentTagName] || [];
  return allowedChildren.includes(childType);
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
