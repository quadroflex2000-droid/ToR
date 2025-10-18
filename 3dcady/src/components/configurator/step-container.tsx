'use client';

import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface StepContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  canProceed?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  nextButtonText?: string;
  errors?: string[];
}

export default function StepContainer({
  title,
  description,
  children,
  onNext,
  onBack,
  canProceed = true,
  isFirstStep = false,
  isLastStep = false,
  nextButtonText,
  errors = [],
}: StepContainerProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Step Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-base sm:text-lg text-gray-600">
            {description}
          </p>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="mb-8">
        {children}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
        <div>
          {!isFirstStep && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Back
            </button>
          )}
        </div>

        <div>
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              disabled={!canProceed}
              className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                canProceed
                  ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  : 'bg-gray-300 cursor-not-allowed'
              } transition-colors`}
            >
              {nextButtonText || (isLastStep ? 'Submit Configuration' : 'Next')}
              {!isLastStep && <ArrowRightIcon className="h-5 w-5 ml-2" aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
