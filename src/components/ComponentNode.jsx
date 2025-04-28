import { COMPONENT_TYPES } from "@/constants/componentTypes";
import { memo, useCallback, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

// Define component nesting rules
const NESTING_RULES = {
  "mj-column": [
    COMPONENT_TYPES.TEXT,
    COMPONENT_TYPES.IMAGE,
    COMPONENT_TYPES.BUTTON,
    COMPONENT_TYPES.DIVIDER,
    COMPONENT_TYPES.SPACER,
  ],
  "mj-section": [COMPONENT_TYPES.COLUMN],
  "mj-body": [COMPONENT_TYPES.SECTION],
};

// Get flex alignment based on vertical-align attribute
const getVerticalAlignClass = verticalAlign => {
  switch (verticalAlign) {
    case "middle":
      return "items-center";
    case "bottom":
      return "items-end";
    default:
      return "items-start"; // top is default
  }
};

// Recursive component to render the component tree
const ComponentNode = ({ node, onSelect, selectedId, path, onDrop, onMove }) => {
  const ref = useRef(null);
  const isSelected = selectedId === node.uuid;

  const [{ isDragging }, drag] = useDrag({
    type: "COMPONENT",
    item: { uuid: node.uuid, path, isNew: false, type: node.tagName },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Check if an item can be dropped in this container
  const canDrop = useCallback(
    item => {
      // For new components, check if the type is allowed
      if (item.isNew) {
        const allowedChildren = NESTING_RULES[node.tagName] || [];
        return allowedChildren.includes(item.type);
      } 
      
      // For reordering (moving) existing components
      else {
        // Allow only if the parent path is the same (reordering within the same parent)
        // or if the type matches the nesting rules
        const itemParentPath = item.path.slice(0, -2);
        const thisParentPath = path.slice(0, -2);
        
        // If we're dropping into ourselves, allow only if the type is allowed
        if (node.uuid === item.uuid) {
          return false;
        }
        
        // Same parent = reordering within the same container (allowed)
        const sameParent = JSON.stringify(itemParentPath) === JSON.stringify(thisParentPath);
        
        // Different parent = moving to new container (check type compatibility)
        if (!sameParent) {
          const allowedChildren = NESTING_RULES[node.tagName] || [];
          return allowedChildren.includes(item.type);
        }
        
        return true;
      }
    },
    [node.tagName, node.uuid, path]
  );

  const handleDrop = useCallback(
    (item, monitor) => {
      if (monitor.didDrop()) return;

      // For new components
      if (item.isNew) {
        onDrop(item.type, path);
      } 
      // For reordering existing components
      else if (JSON.stringify(item.path) !== JSON.stringify(path)) {
        // Check if we're moving within the same parent (reordering)
        const sourceParentPath = item.path.slice(0, -2);
        const targetParentPath = path.slice(0, -2);
        const sameParent = JSON.stringify(sourceParentPath) === JSON.stringify(targetParentPath);
        
        // Allow reordering within the same parent or moving to a valid parent
        if (sameParent || canDrop(item)) {
          onMove(item.path, path);
        }
      }
    },
    [path, onDrop, onMove, canDrop]
  );

  const [{ isOver, canDropHere, isReordering }, drop] = useDrop({
    accept: "COMPONENT",
    drop: handleDrop,
    canDrop,
    collect: monitor => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDropHere: !!monitor.canDrop(),
      isReordering: !!monitor.getItem() && !monitor.getItem().isNew,
    }),
  });

  drag(drop(ref));

  const handleClick = useCallback(
    e => {
      e.stopPropagation();
      onSelect(node);
    },
    [node, onSelect]
  );

  // Determine appropriate drop zone styling
  const getDropIndicatorClass = () => {
    if (!isOver) return "";
    
    if (canDropHere && isReordering) {
      // Valid reordering drop zone
      return "outline outline-2 outline-blue-400 bg-blue-50";
    } else if (canDropHere) {
      // Valid new component drop zone
      return "outline outline-2 outline-green-400 bg-green-50";
    } else {
      // Invalid drop zone
      return "outline outline-2 outline-red-400 bg-red-50";
    }
  };

  const renderChildren = useCallback(() => {
    return (node.children || []).map((child, index) => (
      <ComponentNode
        key={child.uuid}
        node={child}
        onSelect={onSelect}
        selectedId={selectedId}
        path={[...path, "children", index]}
        onDrop={onDrop}
        onMove={onMove}
      />
    ));
  }, [node.children, onSelect, selectedId, path, onDrop, onMove]);

  // Render preview based on component type
  const renderComponentPreview = () => {
    switch (node.tagName) {
      case COMPONENT_TYPES.SECTION:
        return (
          <div
            className="bg-blue-50 p-2 border border-blue-200"
            style={{
              backgroundColor: node.attributes["background-color"] || "#f0f9ff",
            }}
          >
            <div className="text-xs text-blue-500 mb-1">Section</div>
            <div className="pl-2">{renderChildren()}</div>
          </div>
        );
      case COMPONENT_TYPES.COLUMN:
        const verticalAlign = node.attributes["vertical-align"] || "top";
        const verticalAlignClass = getVerticalAlignClass(verticalAlign);

        return (
          <div
            className="bg-green-50 p-2 border border-green-200"
            style={{
              backgroundColor: node.attributes["background-color"] || "transparent",
              padding: node.attributes.padding || "10px",
            }}
          >
            <div className="text-xs text-green-500 mb-1 flex justify-between">
              <span>Column</span>
              {verticalAlign !== "top" && (
                <span className="text-xs px-1.5 py-0.5 bg-green-100 rounded-md">
                  {verticalAlign}
                </span>
              )}
            </div>
            <div className={`pl-2 min-h-20 flex flex-col ${verticalAlignClass}`}>
              {renderChildren()}
            </div>
          </div>
        );
      case COMPONENT_TYPES.IMAGE:
        return (
          <div className="bg-gray-100 p-2 border border-gray-300">
            <div className="text-xs text-gray-500 mb-1">Image</div>
            <div className="w-full h-12 bg-gray-300 flex items-center justify-center text-xs">
              Image: {node.attributes.src?.substring(0, 30)}
              {node.attributes.src?.length > 30 ? "..." : ""}
            </div>
          </div>
        );
      case COMPONENT_TYPES.TEXT:
        return (
          <div className="bg-yellow-50 p-2 border border-yellow-200">
            <div className="text-xs text-yellow-500 mb-1">Text</div>
            <p
              className="text-sm"
              style={{
                color: node.attributes.color,
                fontSize: node.attributes["font-size"],
              }}
            >
              {node.content || "Sample text"}
            </p>
          </div>
        );
      case COMPONENT_TYPES.BUTTON:
        return (
          <div className="bg-purple-50 p-2 border border-purple-200">
            <div className="text-xs text-purple-500 mb-1">Button</div>
            <button
              className="py-1 px-3 rounded text-xs"
              style={{
                backgroundColor: node.attributes["background-color"],
                color: node.attributes.color,
              }}
            >
              {node.content || "Button"}
            </button>
          </div>
        );
      case COMPONENT_TYPES.DIVIDER:
        return (
          <div className="p-2 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Divider</div>
            <hr
              style={{
                borderColor: node.attributes["border-color"],
                borderWidth: node.attributes["border-width"],
              }}
            />
          </div>
        );
      case COMPONENT_TYPES.SPACER:
        return (
          <div className="p-2 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Spacer</div>
            <div
              className="bg-gray-50 border border-dashed border-gray-300 text-xs text-center"
              style={{ height: node.attributes.height }}
            >
              Spacer: {node.attributes.height}
            </div>
          </div>
        );
      default:
        if (node.tagName === "mj-body") {
          return renderChildren();
        }
        return <div>Unknown Component: {node.tagName}</div>;
    }
  };

  // Don't render mjml or mj-body with visual elements
  if (node.tagName === "mjml") {
    return renderChildren();
  }

  return (
    <div
      ref={ref}
      className={`mb-2 
        ${isDragging ? "opacity-50" : "opacity-100"} 
        ${getDropIndicatorClass()}
        ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      onClick={handleClick}
    >
      {renderComponentPreview()}
    </div>
  );
};

export default memo(ComponentNode);
