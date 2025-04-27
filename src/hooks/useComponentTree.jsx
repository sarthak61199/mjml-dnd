import { initializeEmailTemplate } from "@/utils/mjmlInitializer";
import {
  addComponentToTree,
  duplicateComponentInTree,
  findComponentByUuid,
  moveComponentInTree,
  updateComponentInTree,
} from "@/utils/treeManipulation";
import { useCallback, useState } from "react";

export function useComponentTree() {
  const [mjmlJson, setMjmlJson] = useState(initializeEmailTemplate());
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAddComponent = useCallback((component, path) => {
    setMjmlJson(prevState => addComponentToTree(prevState, path, component));
    setSelectedComponent(component);
  }, []);

  const handleMoveComponent = useCallback((fromPath, toPath) => {
    setMjmlJson(prevState => moveComponentInTree(prevState, fromPath, toPath));
  }, []);

  const handleDeleteComponent = useCallback(() => {
    if (!selectedComponent) return;

    const { path } = findComponentByUuid(mjmlJson, selectedComponent.uuid);
    if (path.length === 0) return;

    setMjmlJson(prevState => updateComponentInTree(prevState, path, null));
    setSelectedComponent(null);
    setShowDeleteConfirm(false);
  }, [mjmlJson, selectedComponent]);

  const handleDuplicateComponent = useCallback(() => {
    if (!selectedComponent) return;

    const updatedMjmlJson = duplicateComponentInTree(mjmlJson, selectedComponent.uuid);

    if (updatedMjmlJson !== mjmlJson) {
      setMjmlJson(updatedMjmlJson);
    }
  }, [mjmlJson, selectedComponent]);

  const handleUpdateComponent = useCallback(
    updatedComponentOrAction => {
      // Handle bulk update for vertical alignment
      if (updatedComponentOrAction && updatedComponentOrAction.type === "BULK_UPDATE") {
        setMjmlJson(updatedComponentOrAction.updatedMjmlJson);

        // Keep selected component selected
        if (selectedComponent) {
          const { component } = findComponentByUuid(
            updatedComponentOrAction.updatedMjmlJson,
            selectedComponent.uuid
          );
          if (component) {
            setSelectedComponent(component);
          }
        }
        return;
      }

      // Regular single component update
      if (!selectedComponent) return;

      const { path } = findComponentByUuid(mjmlJson, selectedComponent.uuid);
      if (path.length === 0) return;

      setMjmlJson(prevState => updateComponentInTree(prevState, path, updatedComponentOrAction));
      setSelectedComponent(updatedComponentOrAction === null ? null : updatedComponentOrAction);
    },
    [mjmlJson, selectedComponent]
  );

  const handleDeleteRequest = useCallback(() => {
    if (!selectedComponent) return;

    const hasChildren = selectedComponent.children && selectedComponent.children.length > 0;

    if (hasChildren) {
      setShowDeleteConfirm(true);
    } else {
      handleDeleteComponent();
    }
  }, [selectedComponent, handleDeleteComponent]);

  // Get enhanced selected component with path
  const enhancedSelectedComponent = selectedComponent
    ? { ...selectedComponent, path: findComponentByUuid(mjmlJson, selectedComponent.uuid).path }
    : null;

  return {
    mjmlJson,
    setMjmlJson,
    selectedComponent,
    setSelectedComponent,
    enhancedSelectedComponent,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleAddComponent,
    handleMoveComponent,
    handleDeleteComponent,
    handleDuplicateComponent,
    handleUpdateComponent,
    handleDeleteRequest,
  };
}
