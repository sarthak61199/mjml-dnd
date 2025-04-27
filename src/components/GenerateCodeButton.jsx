import { TABS } from "@/constants/editorConstants";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const GenerateCodeButton = ({
  mjmlJson,
  setMjmlOutput,
  setHtmlOutput,
  setErrors,
  setActiveTab,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    // Convert the JSON structure to indented string for display
    setMjmlOutput(JSON.stringify(mjmlJson, null, 2));
    setIsGenerating(true);

    try {
      // Dynamically import mjml-browser only when needed
      const mjmlModule = await import("mjml-browser");
      const mjml2html = mjmlModule.default;

      // Generate HTML from MJML JSON
      const { html, errors: mjmlErrors } = mjml2html(mjmlJson);
      setHtmlOutput(html);

      // If there are errors but not severe enough to throw an exception, show them
      if (mjmlErrors?.length > 0) {
        setErrors(mjmlErrors);
        console.warn("MJML warnings:", mjmlErrors);
      } else {
        setErrors([]);
      }
    } catch (error) {
      console.error("MJML Error:", error);
      setHtmlOutput(`<p>Error generating HTML: ${error.message}</p>`);
      setErrors([
        {
          message: error.message,
          line: error.line || 0,
          tagName: error.tagName || "unknown",
        },
      ]);
    } finally {
      setIsGenerating(false);
      setActiveTab(TABS.MJML);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      className={`${
        isGenerating ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
      } text-white px-4 py-2 rounded flex items-center justify-center`}
    >
      {isGenerating ? (
        <>
          <Loader2 size={16} className="animate-spin mr-2" />
          Loading...
        </>
      ) : (
        "Generate Code"
      )}
    </button>
  );
};

export default GenerateCodeButton;
