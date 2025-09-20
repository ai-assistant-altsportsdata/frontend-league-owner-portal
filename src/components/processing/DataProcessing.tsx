'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertTriangle, Zap, Database, Search } from 'lucide-react';
import { useOnboardingStore } from '@/stores/onboarding';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { parseCSV, inferDataType, generateId } from '@/lib/utils';
import { ProcessingResult, DataSchema } from '@/types/league';

const PROCESSING_STEPS = [
  { id: 'reading', label: 'Reading files', icon: Search },
  { id: 'parsing', label: 'Parsing data structure', icon: Database },
  { id: 'analyzing', label: 'Analyzing schema', icon: Zap },
  { id: 'generating', label: 'Generating insights', icon: CheckCircle },
];

export function DataProcessing() {
  const {
    files,
    setCurrentStep,
    completeStep,
    addProcessingResult,
    addSchema,
    processingResults,
  } = useOnboardingStore();

  const [currentProcessingStep, setCurrentProcessingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessingResult[]>([]);

  useEffect(() => {
    if (files.length > 0 && results.length === 0) {
      startProcessing();
    }
  }, [files]);

  const startProcessing = async () => {
    setIsProcessing(true);
    const newResults: ProcessingResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // Simulate processing steps
        for (let step = 0; step < PROCESSING_STEPS.length; step++) {
          setCurrentProcessingStep(step);
          setProgress(((i * PROCESSING_STEPS.length + step) / (files.length * PROCESSING_STEPS.length)) * 100);

          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        // Process the actual file
        const result = await processFile(file.file);
        newResults.push(result);
        addProcessingResult(result);

        if (result.schema) {
          addSchema(result.schema);
        }

      } catch (error) {
        const errorResult: ProcessingResult = {
          fileId: file.id,
          success: false,
          error: `Failed to process ${file.name}: ${error}`,
        };
        newResults.push(errorResult);
        addProcessingResult(errorResult);
      }
    }

    setResults(newResults);
    setProgress(100);
    setIsProcessing(false);

    // Complete processing step if all files were successful
    if (newResults.every(r => r.success)) {
      completeStep(2);
    }
  };

  const processFile = async (file: File): Promise<ProcessingResult> => {
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          let data: any[] = [];
          let schema: DataSchema;

          // Parse based on file type
          if (file.name.endsWith('.json')) {
            data = JSON.parse(content);
            if (!Array.isArray(data)) {
              data = [data];
            }
          } else if (file.name.endsWith('.csv')) {
            data = parseCSV(content);
          } else {
            throw new Error('Unsupported file format');
          }

          // Generate schema
          schema = generateSchema(data, file.name);

          // Get preview data (first 5 rows)
          const preview = data.slice(0, 5);

          const result: ProcessingResult = {
            fileId: generateId(),
            success: true,
            schema,
            extractedData: data,
            preview,
            suggestions: generateSuggestions(schema, data),
          };

          resolve(result);
        } catch (error) {
          resolve({
            fileId: generateId(),
            success: false,
            error: `Parse error: ${error}`,
          });
        }
      };

      reader.readAsText(file);
    });
  };

  const generateSchema = (data: any[], fileName: string): DataSchema => {
    if (data.length === 0) {
      return {
        id: generateId(),
        name: fileName.replace(/\.[^/.]+$/, ''),
        type: 'array',
        items: { id: generateId(), name: 'item', type: 'object' },
      };
    }

    const sampleRecord = data[0];
    const properties: { [key: string]: DataSchema } = {};

    Object.keys(sampleRecord).forEach((key) => {
      const values = data.map(record => record[key]).filter(v => v != null);
      const types = values.map(inferDataType);
      const mostCommonType = getMostCommonType(types);

      properties[key] = {
        id: generateId(),
        name: key,
        type: mostCommonType as DataSchema['type'],
        description: `Field: ${key}`,
        example: values[0],
      };
    });

    return {
      id: generateId(),
      name: fileName.replace(/\.[^/.]+$/, ''),
      type: 'array',
      items: {
        id: generateId(),
        name: 'record',
        type: 'object',
        properties,
        required: Object.keys(properties),
      },
    };
  };

  const getMostCommonType = (types: string[]): string => {
    const counts = types.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const generateSuggestions = (schema: DataSchema, data: any[]): string[] => {
    const suggestions: string[] = [];

    if (data.length > 1000) {
      suggestions.push('Large dataset detected - consider data pagination for better performance');
    }

    if (schema.items?.properties) {
      const fieldCount = Object.keys(schema.items.properties).length;
      if (fieldCount > 20) {
        suggestions.push('Many fields detected - consider data normalization');
      }

      // Check for potential ID fields
      const hasIdField = Object.keys(schema.items.properties).some(key =>
        key.toLowerCase().includes('id')
      );
      if (!hasIdField) {
        suggestions.push('Consider adding a unique identifier field');
      }
    }

    suggestions.push('Data structure looks good for integration');
    return suggestions;
  };

  const handleContinue = () => {
    setCurrentStep(3);
  };

  const handleRetry = () => {
    setResults([]);
    setProgress(0);
    setCurrentProcessingStep(0);
    startProcessing();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Processing Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isProcessing ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : results.every(r => r.success) ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            )}
            Data Processing
          </CardTitle>
          <CardDescription>
            {isProcessing
              ? 'Analyzing your data files and generating schemas...'
              : results.every(r => r.success)
              ? 'All files processed successfully!'
              : 'Processing completed with some issues'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Current Step */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg"
            >
              <div className="flex items-center gap-2">
                {React.createElement(PROCESSING_STEPS[currentProcessingStep]?.icon || Loader2, {
                  className: "h-5 w-5 text-primary animate-pulse"
                })}
                <span className="font-medium">
                  {PROCESSING_STEPS[currentProcessingStep]?.label}
                </span>
              </div>
            </motion.div>
          )}

          {/* Processing Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PROCESSING_STEPS.map((step, index) => {
              const isActive = index === currentProcessingStep && isProcessing;
              const isCompleted = index < currentProcessingStep || !isProcessing;

              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    isActive
                      ? 'border-primary bg-primary/5'
                      : isCompleted
                      ? 'border-green-200 bg-green-50'
                      : 'border-muted bg-muted/30'
                  }`}
                >
                  <step.icon
                    className={`h-6 w-6 mx-auto mb-2 ${
                      isActive
                        ? 'text-primary animate-pulse'
                        : isCompleted
                        ? 'text-green-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                  <p className="text-xs font-medium">{step.label}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* File Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Processing Results</h3>
          <div className="grid gap-4">
            {results.map((result, index) => {
              const file = files[index];
              return (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {result.success ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        )}
                        <div>
                          <h4 className="font-medium">{file?.name}</h4>
                          {result.success ? (
                            <p className="text-sm text-muted-foreground">
                              Detected {Object.keys(result.schema?.items?.properties || {}).length} fields,{' '}
                              {result.extractedData?.length || 0} records
                            </p>
                          ) : (
                            <p className="text-sm text-red-600">{result.error}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Suggestions */}
                    {result.suggestions && result.suggestions.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <h5 className="text-sm font-medium text-blue-900 mb-1">Suggestions:</h5>
                        <ul className="text-xs text-blue-700 space-y-1">
                          {result.suggestions.map((suggestion, i) => (
                            <li key={i}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      {!isProcessing && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(1)}
          >
            Back to Files
          </Button>

          <div className="flex gap-3">
            {results.some(r => !r.success) && (
              <Button variant="outline" onClick={handleRetry}>
                Retry Processing
              </Button>
            )}

            {results.some(r => r.success) && (
              <Button onClick={handleContinue}>
                Review Schema
              </Button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}