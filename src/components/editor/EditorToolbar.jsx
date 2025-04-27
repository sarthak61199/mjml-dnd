import { EDITOR_MODES, TABS } from "@/constants/editorConstants";
import { Suspense, lazy } from "react";

const GenerateCodeButton = lazy(() => import("@/components/GenerateCodeButton"));

const LoadingButton = () => (
  <button className="bg-blue-300 text-white px-4 py-2 rounded opacity-70">Generate Code</button>
);

const EditorToolbar = ({
  activeTab,
  editorMode,
  onToggleEditorMode,
  mjmlJson,
  setMjmlOutput,
  setHtmlOutput,
  setErrors,
  setActiveTab,
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl font-bold">MJML Email Template Editor</h1>
      <div className="flex gap-2">
        {activeTab === TABS.EDITOR && (
          <button
            onClick={onToggleEditorMode}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            {editorMode === EDITOR_MODES.STRUCTURE ? "Show Preview" : "Show Structure"}
          </button>
        )}
        <Suspense fallback={<LoadingButton />}>
          <GenerateCodeButton
            mjmlJson={mjmlJson}
            setMjmlOutput={setMjmlOutput}
            setHtmlOutput={setHtmlOutput}
            setErrors={setErrors}
            setActiveTab={setActiveTab}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default EditorToolbar;
