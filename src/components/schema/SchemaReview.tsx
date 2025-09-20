'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Edit, Eye } from 'lucide-react';
import { useOnboardingStore } from '@/stores/onboarding';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SchemaVisualization } from './SchemaVisualization';

export function SchemaReview() {
  const { schemas, setCurrentStep, completeStep } = useOnboardingStore();

  const handleApprove = () => {
    completeStep(3);
    setCurrentStep(4);
  };

  const handleBack = () => {
    setCurrentStep(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-primary" />
            Review Data Schema
          </CardTitle>
          <CardDescription>
            Review the detected data structures and approve for dashboard generation
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Schema Visualizations */}
      <div className="space-y-6">
        {schemas.map((schema, index) => (
          <motion.div
            key={schema.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SchemaVisualization schema={schema} />
          </motion.div>
        ))}
      </div>

      {schemas.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No schemas detected. Please go back and ensure your files were processed successfully.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handleBack}>
          Back to Processing
        </Button>

        <div className="flex gap-3">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Schema
          </Button>

          <Button onClick={handleApprove} disabled={schemas.length === 0}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve & Continue
          </Button>
        </div>
      </div>
    </motion.div>
  );
}