import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const UploadZone = ({ onFileUpload, isLoading }: UploadZoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.docx')) {
      setError('Please upload a valid Word document (.docx)');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileUpload(file);
      }
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileUpload(file);
      }
    }
  }, [onFileUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'upload-zone relative flex flex-col items-center justify-center p-12 cursor-pointer',
          isDragActive && 'upload-zone-active',
          isLoading && 'pointer-events-none opacity-70'
        )}
      >
        <input
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />
        
        <div className={cn(
          'w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 transition-transform duration-300',
          isDragActive && 'scale-110'
        )}>
          {isLoading ? (
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-10 h-10 text-primary" />
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {isLoading ? 'Processing document...' : 'Upload Word Document'}
        </h3>
        
        <p className="text-muted-foreground text-center mb-4">
          {isDragActive 
            ? 'Drop your file here' 
            : 'Drag and drop your .docx file here, or click to browse'
          }
        </p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span>Only .docx files are supported</span>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
