import ComponentNode from "@/components/ComponentNode";
import { COMPONENT_TYPES } from "@/constants/componentTypes";
import { createComponent } from "@/utils/componentCreator";
import { useCallback } from "react";
import { useDrop } from "react-dnd";

// Email canvas where components are dropped
const EmailCanvas = ({
  mjmlJson,
  onAddComponent,
  onMoveComponent,
  selectedComponent,
  setSelectedComponent,
}) => {
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
    },
    [mjmlJson, onAddComponent]
  );

  const [{ isOver }, drop] = useDrop({
    accept: "COMPONENT",
    drop: handleDrop,
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
    </div>
  );
};

export default EmailCanvas;
