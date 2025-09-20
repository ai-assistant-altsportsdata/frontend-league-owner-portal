'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/stores/onboarding';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { LeagueInfoForm } from '@/components/forms/LeagueInfoForm';
import { FileDropzone } from '@/components/dropzone/FileDropzone';
import { DataProcessing } from '@/components/processing/DataProcessing';
import { SchemaReview } from '@/components/schema/SchemaReview';
import { DashboardPreview } from '@/components/dashboard/DashboardPreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const { currentStep, setCurrentStep, canProceedToNext, getSteps } = useOnboardingStore();
  const steps = getSteps();

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <LeagueInfoForm />;
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <FileDropzone />
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
              >
                Process Files
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );
      case 2:
        return <DataProcessing />;
      case 3:
        return <SchemaReview />;
      case 4:
        return <DashboardPreview />;
      default:
        return <LeagueInfoForm />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                AltSports Data Platform
              </h1>
              <p className="text-sm text-muted-foreground">
                League Onboarding & Data Schema Visualization
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </header>

      {/* Progress */}
      <OnboardingProgress />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>
            Powered by AltSports League Intelligence Platform •{' '}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>{' '}
            •{' '}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}