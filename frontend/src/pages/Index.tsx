import { useState, useCallback } from "react";
import UploadZone from "@/components/UploadZone";
import DocumentEditor from "@/components/DocumentEditor";
import DocumentPreview from "@/components/DocumentPreview";
import Toolbar from "@/components/Toolbar";
import { sendEditsToBackend } from "@/lib/documentUtils";
import { FileText } from "lucide-react";
import { saveAs } from "file-saver";

const Index = () => {
  // 🔒 Original DOCX is the source of truth
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  // ✍️ User-editable text (display only)
  const [documentContent, setDocumentContent] = useState<string>("");

  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [originalText, setOriginalText] = useState<string>("");


  /**
   * STEP 1: Upload
   * We DO NOT parse DOCX anymore.
   * We only store the file and show placeholder text for editing.
   */
  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      setOriginalFile(file);
      setFileName(file.name);
  
      const formData = new FormData();
      formData.append("file", file);

      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      if (!API_BASE) throw new Error("API base URL missing");
  
      const response = await fetch(`${API_BASE}/extract-text`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Text extraction failed");
      }
  
      const data = await response.json();
      setOriginalText(data.text || "");
      setDocumentContent(data.text || "");
  
      setIsEditorMode(true);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to load document text.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * STEP 2: Edit (text only)
   */
  const handleContentChange = useCallback((newContent: string) => {
    setDocumentContent(newContent);
  }, []);

  /**
   * STEP 3: Download
   * Send original DOCX + text map to backend
   */
  const handleDownload = useCallback(async () => {
    if (!originalFile) return;
  
    setIsDownloading(true);
    try {
      // Split both versions into paragraphs
      const originalParas = originalText.split(/\n\s*\n/);
      const editedParas = documentContent.split(/\n\s*\n/);
  
      const textMap: Record<string, string> = {};
  
      originalParas.forEach((para, index) => {
        const edited = editedParas[index];
        if (edited && para !== edited) {
          textMap[para] = edited;
        }
      });
  
      const blob = await sendEditsToBackend(originalFile, textMap);
      saveAs(blob, fileName.replace(".docx", "_edited.docx"));
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to generate document.");
    } finally {
      setIsDownloading(false);
    }
  }, [originalFile, originalText, documentContent, fileName]);
  
  

  const handleReset = useCallback(() => {
    setOriginalFile(null);
    setDocumentContent("");
    setFileName("");
    setIsEditorMode(false);
  }, []);

  /**
   * UPLOAD SCREEN
   */
  if (!isEditorMode) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                DocEditor
              </h1>
              <p className="text-xs text-muted-foreground">
                Format-safe Word editor
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <UploadZone onFileUpload={handleFileUpload} isLoading={isLoading} />
        </main>
      </div>
    );
  }

  /**
   * EDITOR SCREEN
   */
  return (
    <div className="h-screen flex flex-col bg-background">
      <Toolbar
        fileName={fileName}
        onDownload={handleDownload}
        onReset={handleReset}
        isDownloading={isDownloading}
      />

      <div className="flex-1 flex gap-4 p-4 min-h-0">
        <div className="flex-1 min-w-0">
          <DocumentEditor
            content={documentContent}
            onChange={handleContentChange}
          />
        </div>
        <div className="flex-1 min-w-0">
          <DocumentPreview content={documentContent} />
        </div>
      </div>
    </div>
  );
};

export default Index;
