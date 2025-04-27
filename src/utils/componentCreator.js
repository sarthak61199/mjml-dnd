import { COMPONENT_TYPES } from "@/constants/componentTypes";
import { v4 as uuidv4 } from "uuid";

// Create new component based on type
export const createComponent = type => {
  const baseComponent = {
    tagName: type,
    uuid: uuidv4(),
    attributes: {},
    children: [],
  };

  switch (type) {
    case COMPONENT_TYPES.TEXT:
      return {
        ...baseComponent,
        attributes: {
          "font-size": "16px",
          color: "#000000",
          "font-family": "Arial, sans-serif",
        },
        content: "This is a text block. Click to edit.",
      };
    case COMPONENT_TYPES.IMAGE:
      return {
        ...baseComponent,
        attributes: {
          src: "https://placehold.co/400x200",
          alt: "Image description",
        },
      };
    case COMPONENT_TYPES.BUTTON:
      return {
        ...baseComponent,
        attributes: {
          "background-color": "#3b82f6",
          color: "#ffffff",
          href: "#",
        },
        content: "Click Me",
      };
    case COMPONENT_TYPES.SPACER:
      return {
        ...baseComponent,
        attributes: {
          height: "20px",
        },
      };
    case COMPONENT_TYPES.DIVIDER:
      return {
        ...baseComponent,
        attributes: {
          "border-color": "#CCCCCC",
          "border-width": "1px",
        },
      };
    case COMPONENT_TYPES.SECTION:
      return {
        ...baseComponent,
        attributes: {
          "background-color": "#ffffff",
          padding: "10px",
        },
        children: [
          {
            tagName: "mj-column",
            uuid: uuidv4(),
            attributes: {},
            children: [],
          },
        ],
      };
    case COMPONENT_TYPES.COLUMN:
      return {
        ...baseComponent,
        attributes: {},
        children: [],
      };
    default:
      return baseComponent;
  }
};
