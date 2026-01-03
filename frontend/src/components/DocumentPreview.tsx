import { Eye } from "lucide-react";

interface DocumentPreviewProps {
  content: string;
}

const DocumentPreview = ({ content }: DocumentPreviewProps) => {
  return (
    <div
      className="h-full flex flex-col preview-container overflow-hidden animate-slide-in"
      style={{ animationDelay: "0.1s" }}
    >
      <div className="toolbar px-4 py-3 flex items-center gap-2">
        <Eye className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Preview</span>
        <span className="text-xs text-muted-foreground ml-2">
          Text-only (final formatting preserved in Word)
        </span>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-card">
        <pre
          className="whitespace-pre-wrap break-words text-sm text-foreground
                     rounded-md border border-border bg-background p-4"
        >
          {content || "Nothing to preview"}
        </pre>
      </div>
    </div>
  );
};

export default DocumentPreview;
