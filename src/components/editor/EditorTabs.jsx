import { useMemo } from "react";
import { TABS } from "@/constants/editorConstants";
import { Loader2 } from "lucide-react";

const EditorTabs = ({
  activeTab,
  onTabChange,
  mjmlOutput,
  htmlOutput,
  errors,
  isGenerating,
  children, // This will be the editor content
}) => {
  // Render the active tab content
  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case TABS.EDITOR:
        return children;
      case TABS.MJML:
        return (
          <div className="flex-1 p-4 overflow-auto">
            {isGenerating ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 size={30} className="animate-spin mx-auto mb-4" />
                  <p>Loading MJML output...</p>
                </div>
              </div>
            ) : (
              <>
                <pre className="bg-gray-800 text-gray-200 p-4 rounded overflow-x-auto whitespace-pre-wrap">
                  {mjmlOutput || "Generate code to see MJML JSON output"}
                </pre>
                {errors.length > 0 && (
                  <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
                    <h3 className="font-bold">Errors/Warnings:</h3>
                    <ul className="list-disc pl-5">
                      {errors.map((err, i) => (
                        <li key={i}>
                          {err.tagName}: {err.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        );
      case TABS.HTML:
        return (
          <div className="flex-1 p-4 overflow-auto">
            {isGenerating ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 size={30} className="animate-spin mx-auto mb-4" />
                  <p>Loading HTML output...</p>
                </div>
              </div>
            ) : (
              <pre className="bg-gray-800 text-gray-200 p-4 rounded overflow-x-auto whitespace-pre-wrap">
                {htmlOutput || "Generate code to see HTML output"}
              </pre>
            )}
          </div>
        );
      default:
        return null;
    }
  }, [activeTab, children, mjmlOutput, htmlOutput, errors, isGenerating]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="mt-4 border-b border-gray-200 bg-white px-4">
        <div className="flex">
          {Object.values(TABS).map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 border-b-2 ${
                activeTab === tab ? "border-blue-500 text-blue-500" : "border-transparent"
              }`}
              onClick={() => onTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {renderTabContent}
    </div>
  );
};

export default EditorTabs;
