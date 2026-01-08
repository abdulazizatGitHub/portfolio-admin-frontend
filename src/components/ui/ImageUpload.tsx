'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  maxSizeMB = 2,
  acceptedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type. Please upload ${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const processFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsDataURL(file);
  }, [onChange, maxSizeMB]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setError('');
    if (onRemove) {
      onRemove();
    } else {
      onChange('');
    }
  }, [onChange, onRemove]);

  return (
    <div className="image-upload-container">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload image"
      />

      {value ? (
        <div className="image-upload-preview">
          <img src={value} alt="Preview" className="preview-image" />
          <button
            type="button"
            onClick={handleRemove}
            className="remove-image-btn"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`image-upload-dropzone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="dropzone-content">
            {isDragging ? (
              <>
                <Upload size={48} className="dropzone-icon" />
                <p className="dropzone-text">Drop image here</p>
              </>
            ) : (
              <>
                <ImageIcon size={48} className="dropzone-icon" />
                <p className="dropzone-text">Drop image here or click to browse</p>
                <p className="dropzone-hint">
                  {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} up to {maxSizeMB}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {error && <p className="image-upload-error">{error}</p>}
    </div>
  );
}


