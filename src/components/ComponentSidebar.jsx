import { memo, useMemo } from "react";

import DraggableComponent from "@/components/DraggableComponent";
import { COMPONENT_TYPES } from "@/constants/componentTypes";

// Component sidebar configuration
const COMPONENT_CONFIG = [
  {
    id: "section",
    type: COMPONENT_TYPES.SECTION,
    label: "Section",
    color: "blue",
  },
  {
    id: "column",
    type: COMPONENT_TYPES.COLUMN,
    label: "Column",
    color: "green",
  },
  { id: "image", type: COMPONENT_TYPES.IMAGE, label: "Image", color: "gray" },
  { id: "text", type: COMPONENT_TYPES.TEXT, label: "Text", color: "yellow" },
  {
    id: "button",
    type: COMPONENT_TYPES.BUTTON,
    label: "Button",
    color: "purple",
  },
  {
    id: "divider",
    type: COMPONENT_TYPES.DIVIDER,
    label: "Divider",
    color: "gray",
  },
  {
    id: "spacer",
    type: COMPONENT_TYPES.SPACER,
    label: "Spacer",
    color: "gray",
  },
];

// Sidebar component with draggable MJML components
const ComponentSidebar = () => {
  const componentList = useMemo(
    () =>
      COMPONENT_CONFIG.map(component => (
        <DraggableComponent key={component.id} component={component} />
      )),
    []
  );

  return (
    <div className="w-64 bg-gray-100 p-4 border-r border-gray-200 h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Components</h2>
      <div className="space-y-2">{componentList}</div>
    </div>
  );
};

export default memo(ComponentSidebar);
