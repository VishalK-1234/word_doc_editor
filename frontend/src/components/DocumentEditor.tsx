import { Edit3 } from "lucide-react";

interface DocumentEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const DocumentEditor = ({ content, onChange }: DocumentEditorProps) => {
  return (
    <div className="h-full flex flex-col editor-container overflow-hidden animate-slide-in">
      <div className="toolbar px-4 py-3 flex items-center gap-2">
        <Edit3 className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Editor</span>
        <span className="text-xs text-muted-foreground ml-2">
          Text-only (format-safe)
        </span>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full resize-none rounded-md border border-border bg-background p-4
                     text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Edit text here…"
        />
      </div>
    </div>
  );
};

export default DocumentEditor;
