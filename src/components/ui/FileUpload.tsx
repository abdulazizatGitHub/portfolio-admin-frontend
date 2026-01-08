'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';

interface FileUploadProps {
  accept: string;
  maxSize: number; // in bytes
  currentFile?: { name: string; size: number };
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  label?: string;
}

export function FileUpload({
  accept,
  maxSize,
  currentFile,
  onFileSelect,
  onFileRemove,
  label = "Drop file here or click to browse"
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
      setError('');
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
      setError('');
    }
  };
  
  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize) {
      setError(`File too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
      return false;
    }
    
    // Check file type
    const extension = file.name.split('.').pop()?.toLowerCase();
    const acceptedExtensions = accept.split(',').map(a => a.trim().replace('.', '').replace('application/', ''));
    
    if (!acceptedExtensions.includes(extension || '')) {
      setError(`Invalid file type. Accepted: ${accept}`);
      return false;
    }
    
    return true;
  };
  
  return (
    <div className="file-upload-container">
      {currentFile ? (
        <div className="file-preview">
          <div className="file-icon">
            <FileText size={32} />
          </div>
          <div className="file-info">
            <span className="file-name">{currentFile.name}</span>
            {currentFile.size > 0 && (
              <span className="file-size">
                ({(currentFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onFileRemove}
            className="file-remove-btn"
            aria-label="Remove file"
          >
            <X size={16} />
            Remove
          </button>
        </div>
      ) : (
        <>
          <div
            className={`file-dropzone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <div className="dropzone-icon">
              {isDragging ? <Upload size={48} /> : <FileText size={48} />}
            </div>
            <div className="dropzone-text">
              {isDragging ? 'Drop file here' : label}
            </div>
            <div className="dropzone-hint">
              Maximum file size: {(maxSize / 1024 / 1024).toFixed(0)}MB
            </div>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={handleFileInput}
              className="hidden"
              aria-label="File upload"
            />
          </div>
          {error && <p className="file-upload-error">{error}</p>}
        </>
      )}
    </div>
  );
}


