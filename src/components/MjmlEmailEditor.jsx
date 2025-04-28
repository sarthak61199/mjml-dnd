import ComponentSidebar from "@/components/ComponentSidebar";
import EditorToolbar from "@/components/editor/EditorToolbar";
import EmailCanvas from "@/components/editor/EmailCanvas";
import { EDITOR_MODES, TABS } from "@/constants/editorConstants";
import { useComponentTree } from "@/hooks/useComponentTree";
import { Loader2 } from "lucide-react";
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const EmailPreview = lazy(() => import("@/components/editor/EmailPreview"));
const PropertiesPanel = lazy(() => import("@/components/PropertiesPanel"));
const EditorTabs = lazy(() => import("@/components/editor/EditorTabs"));

const MjmlEmailEditor = () => {
  const [mjmlOutput, setMjmlOutput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [activeTab, setActiveTab] = useState(TABS.EDITOR);
  const [editorMode, setEditorMode] = useState(EDITOR_MODES.STRUCTURE);
  const [errors, setErrors] = useState([]);
  const {
    mjmlJson,
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
  } = useComponentTree();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = e => {
      // Only process keyboard shortcuts in editor mode
      if (activeTab !== TABS.EDITOR) return;

      // Skip if we're in an input or textarea
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "SELECT"
      )
        return;

      // Delete/Backspace to delete selected component
      if ((e.key === "Delete" || e.key === "Backspace") && selectedComponent) {
        e.preventDefault();
        handleDeleteRequest();
      }

      // Ctrl+D to duplicate component
      if (e.key === "d" && (e.ctrlKey || e.metaKey) && selectedComponent) {
        e.preventDefault();
        handleDuplicateComponent();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeTab, selectedComponent, handleDeleteRequest, handleDuplicateComponent]);

  const handleTabChange = useCallback(tab => {
    setActiveTab(tab);
  }, []);

  const toggleEditorMode = useCallback(() => {
    setEditorMode(prevMode =>
      prevMode === EDITOR_MODES.STRUCTURE ? EDITOR_MODES.PREVIEW : EDITOR_MODES.STRUCTURE
    );
  }, []);

  // Render the editor content based on the mode
  const renderEditorContent = useMemo(() => {
    return (
      <div className="flex-1 flex overflow-hidden">
        <ComponentSidebar />

        {editorMode === EDITOR_MODES.STRUCTURE ? (
          <EmailCanvas
            mjmlJson={mjmlJson}
            onAddComponent={handleAddComponent}
            onMoveComponent={handleMoveComponent}
            selectedComponent={selectedComponent}
            setSelectedComponent={setSelectedComponent}
            moveError={moveError}
          />
        ) : (
          <Suspense
            fallback={
              <div className="flex-1 flex justify-center items-center bg-gray-100">
                <Loader2 className="animate-spin" />
              </div>
            }
          >
            <EmailPreview mjmlJson={mjmlJson} />
          </Suspense>
        )}

        <Suspense
          fallback={
            <div className="w-64 bg-gray-100 p-4 border-l border-gray-200 flex justify-center items-center">
              <Loader2 className="animate-spin" />
            </div>
          }
        >
          <PropertiesPanel
            selectedComponent={enhancedSelectedComponent}
            onUpdateComponent={handleUpdateComponent}
            onDeleteRequest={handleDeleteRequest}
            onConfirmDelete={handleDeleteComponent}
            onDuplicateComponent={handleDuplicateComponent}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
            mjmlJson={mjmlJson}
          />
        </Suspense>
      </div>
    );
  }, [
    mjmlJson,
    enhancedSelectedComponent,
    selectedComponent,
    editorMode,
    handleAddComponent,
    handleMoveComponent,
    handleUpdateComponent,
    handleDeleteRequest,
    handleDeleteComponent,
    handleDuplicateComponent,
    showDeleteConfirm,
    setShowDeleteConfirm,
    moveError,
  ]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        <header className="bg-white border-b border-gray-200 p-4">
          <EditorToolbar
            activeTab={activeTab}
            editorMode={editorMode}
            onToggleEditorMode={toggleEditorMode}
            mjmlJson={mjmlJson}
            setMjmlOutput={setMjmlOutput}
            setHtmlOutput={setHtmlOutput}
            setErrors={setErrors}
            setActiveTab={setActiveTab}
          />
        </header>
        <EditorTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          mjmlJson={mjmlJson}
          mjmlOutput={mjmlOutput}
          htmlOutput={htmlOutput}
          errors={errors}
          isGenerating={false}
        >
          {renderEditorContent}
        </EditorTabs>
      </div>
    </DndProvider>
  );
};

export default MjmlEmailEditor;
