import { Download, FileText, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToolbarProps {
  fileName: string;
  onDownload: () => void;
  onReset: () => void;
  isDownloading: boolean;
}

const Toolbar = ({ fileName, onDownload, onReset, isDownloading }: ToolbarProps) => {
  return (
    <div className="toolbar px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground truncate max-w-[300px]">{fileName}</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-success" />
            Document loaded successfully
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          New Document
        </Button>
        
        <Button
          onClick={onDownload}
          disabled={isDownloading}
          size="sm"
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft"
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download .docx
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
