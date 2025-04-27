import { memo } from "react";
import { useDrag } from "react-dnd";

// Draggable component for the sidebar
const DraggableComponent = ({ component }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "COMPONENT",
    item: {
      type: component.type,
      isNew: true,
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const getBgColor = () => {
    const colorMap = {
      blue: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      green: "bg-green-50 hover:bg-green-100 border-green-200",
      gray: "bg-gray-50 hover:bg-gray-100 border-gray-200",
      yellow: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
      purple: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    };

    return colorMap[component.color] || "bg-white hover:bg-blue-50 border-gray-200";
  };

  return (
    <div
      ref={drag}
      className={`p-2 rounded border cursor-move transition-colors ${getBgColor()}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {component.label}
    </div>
  );
};

export default memo(DraggableComponent);
