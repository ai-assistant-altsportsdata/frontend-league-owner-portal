'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { useOnboardingStore } from '@/stores/onboarding';
import { cn } from '@/lib/utils';

export function OnboardingProgress() {
  const { currentStep, getSteps } = useOnboardingStore();
  const steps = getSteps();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = step.completed;
            const isPast = index < currentStep;

            return (
              <motion.div
                key={step.id}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    'relative flex items-center justify-center w-12 h-12 rounded-full border-2 bg-background transition-all duration-300',
                    {
                      'border-primary bg-primary text-primary-foreground': isActive,
                      'border-green-500 bg-green-500 text-white': isCompleted,
                      'border-muted-foreground text-muted-foreground': !isActive && !isCompleted && !isPast,
                      'border-primary text-primary': isPast && !isCompleted,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}

                  {/* Active Step Pulse */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Step Info */}
                <div className="mt-3 text-center max-w-32">
                  <h3
                    className={cn(
                      'text-sm font-medium transition-colors',
                      {
                        'text-primary': isActive,
                        'text-green-600': isCompleted,
                        'text-muted-foreground': !isActive && !isCompleted,
                      }
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-tight">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current Step Details */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-8 text-center"
      >
        <div className="bg-card border rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">
            {steps[currentStep]?.title}
          </h2>
          <p className="text-muted-foreground">
            {steps[currentStep]?.description}
          </p>

          {/* Step Counter */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <Circle className="h-1 w-1 fill-current" />
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}