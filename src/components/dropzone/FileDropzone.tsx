'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2, Zap } from 'lucide-react';
import { cn, formatFileSize, generateId, validateFile, getFileType } from '@/lib/utils';
import { FileUpload } from '@/types/league';
import { useOnboardingStore } from '@/stores/onboarding';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileDropzoneProps {
  className?: string;
  maxFiles?: number;
  onFilesAdded?: (files: FileUpload[]) => void;
}

export function FileDropzone({ className, maxFiles = 5, onFilesAdded }: FileDropzoneProps) {
  const { files, addFile, updateFile, removeFile } = useOnboardingStore();
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: FileUpload[] = [];

      acceptedFiles.forEach((file) => {
        const validation = validateFile(file);
        const fileUpload: FileUpload = {
          id: generateId(),
          name: file.name,
          size: file.size,
          type: getFileType(file),
          lastModified: file.lastModified,
          file,
          uploadStatus: validation.valid ? 'pending' : 'error',
          uploadProgress: 0,
          error: validation.error,
        };

        addFile(fileUpload);
        newFiles.push(fileUpload);

        // Start upload simulation if valid
        if (validation.valid) {
          simulateUpload(fileUpload.id);
        }
      });

      onFilesAdded?.(newFiles);
    },
    [addFile, onFilesAdded]
  );

  const simulateUpload = useCallback(
    (fileId: string) => {
      updateFile(fileId, { uploadStatus: 'uploading' });

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          updateFile(fileId, {
            uploadStatus: 'completed',
            uploadProgress: 100,
          });
          clearInterval(interval);
        } else {
          updateFile(fileId, { uploadProgress: progress });
        }
      }, 200);
    },
    [updateFile]
  );

  const addTestFiles = useCallback(() => {
    const testFiles = [
      {
        name: 'players.csv',
        size: 45000,
        type: 'csv' as const,
        content: 'Sample player data with stats, positions, and performance metrics',
      },
      {
        name: 'games.json',
        size: 32000,
        type: 'json' as const,
        content: 'Game results, scores, and match statistics',
      },
      {
        name: 'teams.xlsx',
        size: 28000,
        type: 'excel' as const,
        content: 'Team information, roster details, and standings',
      },
    ];

    testFiles.forEach((testFile) => {
      const mockFile = new (File as any)(['mock content'], testFile.name, {
        type: testFile.type === 'csv' ? 'text/csv' : 
              testFile.type === 'json' ? 'application/json' :
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        lastModified: Date.now(),
      });

      const fileUpload: FileUpload = {
        id: generateId(),
        name: testFile.name,
        size: testFile.size,
        type: testFile.type,
        lastModified: Date.now(),
        file: mockFile,
        uploadStatus: 'pending',
        uploadProgress: 0,
      };

      addFile(fileUpload);
      
      // Start upload simulation
      setTimeout(() => {
        simulateUpload(fileUpload.id);
      }, Math.random() * 1000);
    });
  }, [addFile, simulateUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles,
    disabled: files.length >= maxFiles,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'csv':
        return '📊';
      case 'json':
        return '🔗';
      case 'excel':
        return '📈';
      default:
        return '📄';
    }
  };

  const getStatusIcon = (status: FileUpload['uploadStatus']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with Test Files Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Upload Data Files</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTestFiles}
          disabled={files.length >= maxFiles}
          className="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700"
        >
          <Zap className="h-4 w-4" />
          Add Test Files
        </Button>
      </div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          'upload-zone cursor-pointer',
          {
            'dragover': isDragActive || dragActive,
            'has-files': files.length > 0,
          }
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-6">
            <Upload className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? 'Drop files here!' : 'Upload your league data'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop CSV, JSON, or Excel files, or click to browse
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span className="bg-secondary px-2 py-1 rounded">CSV</span>
              <span className="bg-secondary px-2 py-1 rounded">JSON</span>
              <span className="bg-secondary px-2 py-1 rounded">Excel</span>
              <span className="bg-secondary px-2 py-1 rounded">Max 50MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="text-2xl">{getFileIcon(file.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    {getStatusIcon(file.uploadStatus)}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    <span className="capitalize">{file.type}</span>
                    {file.uploadStatus === 'error' && file.error && (
                      <span className="text-red-500">{file.error}</span>
                    )}
                  </div>

                  {(file.uploadStatus === 'uploading' || file.uploadStatus === 'processing') && (
                    <div className="mt-2">
                      <Progress value={file.uploadProgress} className="h-1" />
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Summary */}
      {files.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
          <div className="text-sm">
            <span className="font-medium">
              {files.filter(f => f.uploadStatus === 'completed').length} of {files.length} files uploaded
            </span>
            {files.some(f => f.uploadStatus === 'error') && (
              <span className="text-red-500 ml-2">
                ({files.filter(f => f.uploadStatus === 'error').length} failed)
              </span>
            )}
          </div>

          {files.every(f => f.uploadStatus === 'completed') && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Ready to process</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}