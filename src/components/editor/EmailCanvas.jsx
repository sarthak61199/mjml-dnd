import ComponentNode from "@/components/ComponentNode";
import { COMPONENT_TYPES } from "@/constants/componentTypes";
import { createComponent } from "@/utils/componentCreator";
import { useCallback, useState, useEffect } from "react";
import { useDrop } from "react-dnd";

// Email canvas where components are dropped
const EmailCanvas = ({
  mjmlJson,
  onAddComponent,
  onMoveComponent,
  selectedComponent,
  setSelectedComponent,
  moveError,
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Handle displaying move errors
  useEffect(() => {
    if (moveError) {
      setErrorMessage(moveError.message);
      
      // Clear the error message after 3 seconds
      const timeout = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [moveError]);

  const handleDrop = useCallback(
    (item, monitor) => {
      if (monitor.didDrop()) return;

      // Only allow dropping a Section if the canvas is empty
      if (
        item.isNew &&
        item.type === COMPONENT_TYPES.SECTION &&
        mjmlJson.children[0].children.length === 0
      ) {
        onAddComponent(createComponent(item.type), ["children", 0, "children"]);
      }
      
      // Reset dragged item when drop completes
      setDraggedItem(null);
    },
    [mjmlJson, onAddComponent]
  );

  const [{ isOver }, drop] = useDrop({
    accept: "COMPONENT",
    drop: handleDrop,
    hover: (item) => {
      // Track which item is being dragged for better UI feedback
      setDraggedItem(item);
    },
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const handleSelect = useCallback(
    component => {
      setSelectedComponent(component);
    },
    [setSelectedComponent]
  );

  const bodyComponent = mjmlJson.children.find(child => child.tagName === "mj-body");
  const isEmpty = bodyComponent.children.length === 0;

  return (
    <div
      ref={drop}
      className={`flex-1 p-4 bg-gray-50 overflow-y-auto ${isOver ? "bg-blue-50" : ""}`}
      style={{ minHeight: "500px" }}
    >
      <div className="mx-auto max-w-md bg-white shadow p-4">
        {isEmpty ? (
          <div className="text-center text-gray-400 p-6 border-2 border-dashed border-gray-300 rounded">
            Drag a section component here to start building your email
          </div>
        ) : (
          <ComponentNode
            node={mjmlJson}
            onSelect={handleSelect}
            selectedId={selectedComponent?.uuid}
            path={[]}
            onDrop={(type, path) => onAddComponent(createComponent(type), path)}
            onMove={onMoveComponent}
          />
        )}
      </div>
      
      {/* Reordering indicator */}
      {draggedItem && !draggedItem.isNew && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50">
          Reordering: {draggedItem.type.replace('mj-', '')}
        </div>
      )}
      
      {/* Error message */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default EmailCanvas;
