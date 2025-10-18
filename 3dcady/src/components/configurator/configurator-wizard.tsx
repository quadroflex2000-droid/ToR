'use client';

import React, { useEffect, useState } from 'react';
import { useConfigurator } from '@/contexts/configurator-context';
import WizardProgressBar from './wizard-progress-bar';
import StepContainer from './step-container';
import GenericOptionStep from './steps/generic-option-step';
import SummaryStep from './steps/summary-step';
import { evaluateConditionalLogic } from '@/lib/configurator/validation';
import type { OptionCategory, ProductTypeName, ClientData } from '@/types';

interface ConfiguratorWizardProps {
  productType: ProductTypeName;
}

export default function ConfiguratorWizard({ productType }: ConfiguratorWizardProps) {
  const { state, initializeWizard, navigateToStep, updateSelection, submitConfiguration } = useConfigurator();
  const [visibleSteps, setVisibleSteps] = useState<OptionCategory[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize wizard on mount
  useEffect(() => {
    const init = async () => {
      try {
        await initializeWizard(productType);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize wizard:', error);
      }
    };

    if (!isInitialized) {
      init();
    }
  }, [productType, initializeWizard, isInitialized]);

  // Calculate visible steps based on conditional logic
  useEffect(() => {
    if (state.categoriesCache.length > 0) {
      const visible = state.categoriesCache.filter((category) => {
        if (!category.conditionalDisplay) {
          return true; // Always show if no conditions
        }
        return evaluateConditionalLogic(category.conditionalDisplay, state.configuration.selections);
      });
      setVisibleSteps(visible);
    }
  }, [state.categoriesCache, state.configuration.selections]);

  // Loading state
  if (state.isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading configurator...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!state.productType || visibleSteps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuration Error</h2>
          <p className="text-gray-600 mb-4">Unable to load configurator options. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const currentCategory = visibleSteps[state.currentStep];
  const isSummaryStep = state.currentStep === visibleSteps.length; // Summary is after all category steps
  const isLastStep = state.currentStep === visibleSteps.length;
  const isFirstStep = state.currentStep === 0;

  // Progress bar steps (include summary)
  const progressSteps = [
    ...visibleSteps.map((category) => ({
      id: category.id,
      title: category.title,
    })),
    {
      id: 'summary',
      title: 'Summary',
    },
  ];

  // Handle next step
  const handleNext = () => {
    if (state.currentStep < visibleSteps.length) {
      navigateToStep(state.currentStep + 1);
    }
  };

  // Handle configuration submission
  const handleSubmit = async (clientData: ClientData, notes: string) => {
    try {
      await submitConfiguration(clientData, notes);
    } catch (error) {
      throw error; // Let SummaryStep handle the error display
    }
  };

  // Handle back step
  const handleBack = () => {
    if (state.currentStep > 0) {
      navigateToStep(state.currentStep - 1);
    }
  };

  // Handle step click from progress bar
  const handleStepClick = (stepIndex: number) => {
    navigateToStep(stepIndex);
  };

  // Get current selection for the step
  const getCurrentSelection = () => {
    if (!currentCategory) return null;
    return state.configuration.selections[currentCategory.name as keyof typeof state.configuration.selections];
  };

  // Handle selection update
  const handleSelectionUpdate = (value: any) => {
    if (!currentCategory) return;
    updateSelection(currentCategory.name, value);
  };

  // Check if current step is complete
  const isStepComplete = () => {
    if (!currentCategory) return false;
    if (!currentCategory.isRequired) return true;
    
    const selection = getCurrentSelection();
    
    if (currentCategory.allowsMultiple) {
      return Array.isArray(selection) && selection.length > 0;
    }
    
    return selection != null && selection !== undefined;
  };

  // Render current step content
  const renderStepContent = () => {
    // Summary step (last step)
    if (isSummaryStep) {
      return <SummaryStep onSubmit={handleSubmit} />;
    }

    if (!currentCategory) {
      return <div>No content available</div>;
    }

    return (
      <GenericOptionStep
        category={currentCategory}
        selectedValue={getCurrentSelection()}
        onSelect={handleSelectionUpdate}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {state.productType === 'kitchen' ? 'Kitchen' : 'Wardrobe'} Configurator
              </h1>
              <p className="text-sm text-gray-600">
                Step {state.currentStep + 1} of {visibleSteps.length}
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/configurator'}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WizardProgressBar
            steps={progressSteps}
            currentStep={state.currentStep}
            onStepClick={handleStepClick}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isSummaryStep ? (
          // Summary step without StepContainer wrapper (has its own layout)
          <div className="w-full max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Review & Submit
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Review your configuration and provide your contact information
              </p>
            </div>
            <div className="mb-8">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>
            {renderStepContent()}
          </div>
        ) : (
          <StepContainer
            title={currentCategory?.title || 'Configuration Step'}
            description={currentCategory?.isRequired ? 'This step is required' : 'This step is optional'}
            onNext={handleNext}
            onBack={handleBack}
            canProceed={isStepComplete()}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            errors={state.errors[currentCategory?.name] || []}
          >
            {renderStepContent()}
          </StepContainer>
        )}
      </div>
    </div>
  );
}
