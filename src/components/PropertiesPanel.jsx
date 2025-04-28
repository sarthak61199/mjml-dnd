import {
  ButtonProperties,
  ColumnProperties,
  DividerProperties,
  ImageProperties,
  SectionProperties,
  SpacerProperties,
  TextProperties,
} from "@/components/component-properties";
import { COMPONENT_TYPES } from "@/constants/componentTypes";
import { updateVerticalAlignForSection } from "@/utils/helpers";
import { Copy, Trash2 } from "lucide-react";
import { useCallback } from "react";

// Properties panel for editing selected component
const PropertiesPanel = ({
  selectedComponent,
  onUpdateComponent,
  onDeleteRequest,
  onConfirmDelete,
  onDuplicateComponent,
  showDeleteConfirm,
  setShowDeleteConfirm,
  mjmlJson,
}) => {
  // Cancel delete confirmation - moved outside conditional rendering
  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirm(false);
  }, [setShowDeleteConfirm]);

  if (!selectedComponent) {
    return (
      <div className="w-64 bg-gray-100 p-4 border-l border-gray-200">
        <h2 className="text-lg font-bold mb-4">Properties</h2>
        <p className="text-gray-500">Select a component to edit its properties</p>
      </div>
    );
  }

  const updateAttribute = (key, value) => {
    const updatedComponent = {
      ...selectedComponent,
      attributes: {
        ...selectedComponent.attributes,
        [key]: value,
      },
    };
    onUpdateComponent(updatedComponent);
  };

  const updateContent = content => {
    const updatedComponent = { ...selectedComponent, content };
    onUpdateComponent(updatedComponent);
  };

  // Apply vertical alignment to all columns in a section
  const applyVerticalAlignToSection = (path, verticalAlign) => {
    const updatedMjmlJson = updateVerticalAlignForSection(mjmlJson, path, verticalAlign);
    // We need to call a special update handler for this since it affects multiple components
    if (updatedMjmlJson !== mjmlJson) {
      onUpdateComponent({
        type: "BULK_UPDATE",
        updatedMjmlJson,
      });
    }
  };

  // Handle vertical alignment change
  const handleVerticalAlignChange = value => {
    if (selectedComponent.tagName === COMPONENT_TYPES.COLUMN && selectedComponent.path) {
      // Apply to all columns in the section automatically
      applyVerticalAlignToSection(selectedComponent.path, value);
    } else {
      // Regular single attribute update (fallback, shouldn't happen for columns)
      updateAttribute("vertical-align", value);
    }
  };

  // Check if component has children
  const hasChildren = selectedComponent.children && selectedComponent.children.length > 0;

  // Render different property fields based on component type
  const renderProperties = () => {
    switch (selectedComponent.tagName) {
      case COMPONENT_TYPES.TEXT:
        return (
          <TextProperties
            selectedComponent={selectedComponent}
            updateAttribute={updateAttribute}
            updateContent={updateContent}
          />
        );
      case COMPONENT_TYPES.IMAGE:
        return (
          <ImageProperties
            selectedComponent={selectedComponent}
            updateAttribute={updateAttribute}
          />
        );
      case COMPONENT_TYPES.BUTTON:
        return (
          <ButtonProperties
            selectedComponent={selectedComponent}
            updateAttribute={updateAttribute}
            updateContent={updateContent}
          />
        );
      case COMPONENT_TYPES.SPACER:
        return (
          <SpacerProperties
            selectedComponent={selectedComponent}
            updateAttribute={updateAttribute}
          />
        );
      case COMPONENT_TYPES.SECTION:
        return (
          <SectionProperties
            selectedComponent={selectedComponent}
            updateAttribute={updateAttribute}
          />
        );
      case COMPONENT_TYPES.DIVIDER:
        return (
          <DividerProperties
            selectedComponent={selectedComponent}
            updateAttribute={updateAttribute}
          />
        );
      case COMPONENT_TYPES.COLUMN:
        return (
          <ColumnProperties
            selectedComponent={selectedComponent}
            updateAttribute={updateAttribute}
            handleVerticalAlignChange={handleVerticalAlignChange}
          />
        );
      default:
        return <p>No editable properties</p>;
    }
  };

  return (
    <div className="w-64 bg-gray-100 p-4 border-l border-gray-200">
      <div className="mb-2 space-y-2">
        <h2 className="text-lg font-bold">Properties</h2>
        <div className="flex space-x-2">
          <button
            onClick={onDuplicateComponent}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1 rounded flex items-center"
            title="Duplicate component"
          >
            <Copy size={16} className="mr-1" />
            <span>Duplicate</span>
          </button>
          <button
            onClick={onDeleteRequest}
            className="bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded flex items-center"
            title="Delete component"
          >
            <Trash2 size={16} className="mr-1" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 text-right">
          Press Del or Backspace to delete | Ctrl+D to duplicate
        </p>
        <p className="font-medium mt-1">
          {selectedComponent.tagName.replace("mj-", "").charAt(0).toUpperCase() +
            selectedComponent.tagName.replace("mj-", "").slice(1)}
        </p>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded">
          <p className="text-red-700 mb-2">
            {hasChildren
              ? `This component has ${selectedComponent.children.length} child component(s). Deleting it will also delete all children.`
              : "Are you sure you want to delete this component?"}
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleDeleteCancel}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmDelete}
              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm flex items-center"
            >
              <Trash2 size={12} className="mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}

      {renderProperties()}
    </div>
  );
};

export default PropertiesPanel;
