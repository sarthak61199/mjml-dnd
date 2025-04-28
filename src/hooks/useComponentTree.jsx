import { initializeEmailTemplate } from "@/utils/mjmlInitializer";
import {
  addComponentToTree,
  duplicateComponentInTree,
  findComponentByUuid,
  moveComponentInTree,
  updateComponentInTree,
  canBeChild,
} from "@/utils/treeManipulation";
import { useCallback, useState } from "react";

export function useComponentTree() {
  const [mjmlJson, setMjmlJson] = useState(initializeEmailTemplate());
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [moveError, setMoveError] = useState(null);

  const handleAddComponent = useCallback((component, path) => {
    setMjmlJson(prevState => addComponentToTree(prevState, path, component));
    setSelectedComponent(component);
  }, []);

  const handleMoveComponent = useCallback((fromPath, toPath) => {
    // Reset any previous move errors
    setMoveError(null);
    
    // Validate that the paths are different
    if (JSON.stringify(fromPath) === JSON.stringify(toPath)) {
      return;
    }
    
    // Check if we're moving within the same parent (reordering) or to a different parent
    const sourceParentPath = fromPath.slice(0, -2);
    const targetParentPath = toPath.slice(0, -2);
    const sameParent = JSON.stringify(sourceParentPath) === JSON.stringify(targetParentPath);
    
    // If moving to a different parent, verify parent-child relationship constraints
    if (!sameParent) {
      // Get the component being moved
      const { component: sourceComponent } = findComponentByUuid(
        mjmlJson, 
        findComponentByUuid(mjmlJson, null, fromPath).component.uuid
      );
      
      // Get the target parent component
      const { component: targetParent } = findComponentByUuid(
        mjmlJson, 
        findComponentByUuid(mjmlJson, null, targetParentPath).component.uuid
      );
      
      // Verify if the component can be a child of the target parent
      if (targetParent && sourceComponent) {
        const canMove = canBeChild(targetParent.tagName, sourceComponent.tagName);
        if (!canMove) {
          console.error(`Cannot move ${sourceComponent.tagName} to ${targetParent.tagName}`);
          setMoveError({
            message: `Cannot place ${sourceComponent.tagName.replace('mj-', '')} inside ${targetParent.tagName.replace('mj-', '')}`,
            timestamp: Date.now()
          });
          return;
        }
      }
    }
    
    // Perform the move operation
    const updatedTree = moveComponentInTree(mjmlJson, fromPath, toPath);
    
    // Only update the tree if the move was successful
    if (updatedTree !== mjmlJson) {
      setMjmlJson(updatedTree);
      
      // If the selected component was moved, update the selection
      if (selectedComponent) {
        const { component: updatedComponent } = findComponentByUuid(updatedTree, selectedComponent.uuid);
        if (updatedComponent) {
          setSelectedComponent(updatedComponent);
        }
      }
    }
  }, [mjmlJson, selectedComponent]);

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
    moveError,
    handleAddComponent,
    handleMoveComponent,
    handleDeleteComponent,
    handleDuplicateComponent,
    handleUpdateComponent,
    handleDeleteRequest,
  };
}
