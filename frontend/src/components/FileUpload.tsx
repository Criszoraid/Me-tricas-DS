import { useState, useRef } from 'react';
import { api } from '../services/api';
import './FileUpload.css';

interface FileUploadProps {
  type: 'design' | 'development' | 'kpi' | 'okr';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function FileUpload({ type, onSuccess, onError }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isValidType = file.name.endsWith('.json') || file.name.endsWith('.csv');
    if (!isValidType) {
      onError?.('Por favor, sube un archivo JSON o CSV');
      return;
    }

    setFileName(file.name);
    setIsUploading(true);

    try {
      const fileContent = await file.text();
      
      if (type === 'kpi' || type === 'okr') {
        await api.uploadKPIOrOKRFile({
          type,
          fileContent,
          fileName: file.name,
        });
      } else {
        await api.uploadMetricsFile({
          type,
          fileContent,
          fileName: file.name,
        });
      }

      onSuccess?.();
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFileName(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Error al subir el archivo';
      onError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="file-upload-input"
        disabled={isUploading}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={isUploading}
        className="file-upload-button"
      >
        {isUploading ? '📤 Subiendo...' : '📁 Subir archivo'}
      </button>
      {fileName && !isUploading && (
        <span className="file-upload-name">{fileName}</span>
      )}
    </div>
  );
}
