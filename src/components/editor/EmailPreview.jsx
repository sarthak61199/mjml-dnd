import { MoveHorizontal } from "lucide-react";
import mjml2html from "mjml-browser";
import { Resizable } from "re-resizable";
import { useEffect, useRef, useState } from "react";

const EmailPreview = ({ mjmlJson }) => {
  const iframeRef = useRef(null);
  const [size, setSize] = useState({ width: 768, height: 600 });

  useEffect(() => {
    if (!mjmlJson || !iframeRef.current) return;

    try {
      // Convert MJML to HTML
      const { html, errors } = mjml2html(mjmlJson);

      // Log any errors but continue rendering
      if (errors?.length > 0) {
        console.warn("MJML Preview Warnings:", errors);
      }

      // Get the iframe document
      const iframeDoc =
        iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;

      // Write the HTML to the iframe
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();
    } catch (error) {
      console.error("Error rendering MJML preview:", error);

      // Show error message in iframe
      const iframeDoc =
        iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <div style="color: red; font-family: sans-serif; padding: 20px;">
          <h3>Error Rendering Preview</h3>
          <p>${error.message}</p>
        </div>
      `);
      iframeDoc.close();
    }
  }, [mjmlJson]);

  return (
    <div className="preview-container flex-1 bg-gray-100 p-4 overflow-auto">
      <div className="flex flex-col items-center">
        <div className="mb-2 flex items-center gap-4">
          <div className="text-sm font-medium">
            <span>
              {Math.round(size.width)} × {Math.round(size.height)} px
            </span>
          </div>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
              onClick={() => setSize({ width: 320, height: 568 })}
            >
              Mobile
            </button>
            <button
              className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
              onClick={() => setSize({ width: 768, height: 600 })}
            >
              Tablet
            </button>
            <button
              className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
              onClick={() => setSize({ width: 1024, height: 768 })}
            >
              Desktop
            </button>
          </div>
        </div>

        <Resizable
          size={size}
          onResizeStop={(e, direction, ref, d) => {
            setSize({
              width: size.width + d.width,
              height: size.height + d.height,
            });
          }}
          minWidth={280}
          minHeight={400}
          maxWidth="100%"
          className="bg-white shadow-md"
          handleStyles={{
            bottomRight: {
              right: -12,
              bottom: -12,
              width: 24,
              height: 24,
            },
          }}
          handleComponent={{
            bottomRight: (
              <div className="bg-blue-500 rounded-sm size-6 p-1 cursor-se-resize grid place-items-center">
                <MoveHorizontal className="rotate-45 text-white size-full" />
              </div>
            ),
          }}
        >
          <iframe
            ref={iframeRef}
            title="Email Preview"
            className="w-full h-full"
            style={{
              border: "none",
              margin: "0 auto",
              display: "block",
            }}
          />
        </Resizable>
      </div>
    </div>
  );
};

export default EmailPreview;
