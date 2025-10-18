'use client';

import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

interface WizardProgressBarProps {
  steps: { id: string; title: string }[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export default function WizardProgressBar({ steps, currentStep, onStepClick }: WizardProgressBarProps) {
  return (
    <div className="w-full py-6">
      {/* Mobile: Simple step indicator */}
      <div className="block md:hidden">
        <div className="text-sm text-gray-600 text-center mb-2">
          Step {currentStep + 1} of {steps.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="text-sm font-medium text-gray-900 text-center mt-2">
          {steps[currentStep]?.title}
        </div>
      </div>

      {/* Desktop: Full step list */}
      <div className="hidden md:block">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center justify-between">
            {steps.map((step, stepIdx) => {
              const isComplete = stepIdx < currentStep;
              const isCurrent = stepIdx === currentStep;
              const isClickable = onStepClick && stepIdx <= currentStep;

              return (
                <li key={step.id} className={`flex-1 ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} relative`}>
                  {stepIdx !== steps.length - 1 && (
                    <div className="absolute top-4 left-0 -ml-px mt-0.5 h-0.5 w-full" aria-hidden="true">
                      <div className={`h-full ${isComplete ? 'bg-blue-600' : 'bg-gray-200'} transition-colors duration-300`} />
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => isClickable && onStepClick(stepIdx)}
                    disabled={!isClickable}
                    className={`group relative flex flex-col items-center ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  >
                    <span className="flex h-9 w-9 items-center justify-center">
                      {isComplete ? (
                        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 group-hover:bg-blue-700 transition-colors">
                          <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                        </span>
                      ) : isCurrent ? (
                        <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
                          <span className="h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden="true" />
                        </span>
                      ) : (
                        <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400 transition-colors">
                          <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" aria-hidden="true" />
                        </span>
                      )}
                    </span>
                    <span className={`mt-2 text-xs sm:text-sm font-medium ${
                      isCurrent ? 'text-blue-600' : 
                      isComplete ? 'text-gray-900' : 
                      'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
