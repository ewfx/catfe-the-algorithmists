
import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { UploadCloud, X, FileText, FilePlus } from "lucide-react";
import { formatFileSize } from "@/utils/fileUtils";

interface FileDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string;
  currentFiles?: File[];
  className?: string;
}

export function FileDropzone({
  onFilesAdded,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept = "*",
  currentFiles = [],
  className,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const newFiles = Array.from(e.dataTransfer.files);
    processFiles(newFiles);
  }, [currentFiles, maxFiles, maxSize, accept, onFilesAdded]);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      processFiles(newFiles);
      
      // Reset the input value so the same file can be uploaded again
      e.target.value = '';
    }
  }, [currentFiles, maxFiles, maxSize, accept, onFilesAdded]);
  
  const processFiles = (newFiles: File[]) => {
    setError(null);
    
    // Check file count
    if (currentFiles.length + newFiles.length > maxFiles) {
      setError(`Cannot add more than ${maxFiles} files`);
      return;
    }
    
    // Check file types and sizes
    const invalidFiles = newFiles.filter(file => {
      if (accept !== "*" && !accept.split(",").some(type => {
        if (type.startsWith(".")) {
          // Extension check
          return file.name.endsWith(type);
        } else if (type.endsWith("/*")) {
          // MIME type category check (e.g., "image/*")
          return file.type.startsWith(type.replace("/*", "/"));
        } else {
          // Exact MIME type check
          return file.type === type;
        }
      })) {
        return true;
      }
      
      if (file.size > maxSize) {
        return true;
      }
      
      return false;
    });
    
    if (invalidFiles.length > 0) {
      setError(`Some files were invalid. Please check file types and ensure they are under ${formatFileSize(maxSize)}`);
      return;
    }
    
    onFilesAdded(newFiles);
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...currentFiles];
    newFiles.splice(index, 1);
    onFilesAdded(newFiles);
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors",
          "text-center cursor-pointer hover:bg-muted/30",
          isDragging ? "border-primary bg-accent/50" : "border-input",
          "relative"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept={accept}
          multiple={maxFiles > 1}
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center animate-pulse">
            <UploadCloud className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Drag and drop or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              {accept === "*" ? "Any file format" : `Accepts: ${accept}`} up to {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="text-destructive text-sm p-2 bg-destructive/10 rounded-md">
          {error}
        </div>
      )}
      
      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded files ({currentFiles.length}/{maxFiles})</p>
          <div className="space-y-2">
            {currentFiles.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 rounded-md bg-accent/30 text-sm animate-slideIn"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {currentFiles.length < maxFiles && (
        <button
          type="button"
          className="text-sm flex items-center justify-center w-full py-1.5 border border-input rounded-md hover:bg-accent/30 transition-colors"
          onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
        >
          <FilePlus className="h-4 w-4 mr-1.5" />
          Add more files
        </button>
      )}
    </div>
  );
}
