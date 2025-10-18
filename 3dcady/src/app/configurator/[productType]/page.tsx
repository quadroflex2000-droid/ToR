'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ConfiguratorProvider, useConfigurator } from '@/contexts/configurator-context';
import ConfiguratorWizard from '@/components/configurator/configurator-wizard';
import type { ProductTypeName } from '@/types';

function ConfiguratorPageContent() {
  const params = useParams();
  const router = useRouter();
  const { restoreSavedState, clearState } = useConfigurator();
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [productType, setProductType] = useState<ProductTypeName | null>(null);

  useEffect(() => {
    // Validate product type from URL
    const typeParam = params.productType as string;
    
    if (typeParam !== 'kitchen' && typeParam !== 'wardrobe') {
      // Invalid product type, redirect to selector
      router.push('/configurator');
      return;
    }

    setProductType(typeParam as ProductTypeName);

    // Check for saved state
    const hasSavedState = restoreSavedState();
    if (hasSavedState) {
      setShowRestorePrompt(true);
    }
  }, [params.productType, router, restoreSavedState]);

  const handleContinue = () => {
    setShowRestorePrompt(false);
  };

  const handleStartFresh = () => {
    clearState();
    setShowRestorePrompt(false);
    // Reload to start fresh
    window.location.reload();
  };

  if (!productType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Restore prompt modal
  if (showRestorePrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Resume Configuration?
          </h2>
          <p className="text-gray-600 text-center mb-6">
            We found a saved {productType} configuration. Would you like to continue where you left off or start fresh?
          </p>
          <div className="space-y-3">
            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue Configuration
            </button>
            <button
              onClick={handleStartFresh}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start Fresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <ConfiguratorWizard productType={productType} />;
}

export default function ConfiguratorProductTypePage() {
  return (
    <ConfiguratorProvider>
      <ConfiguratorPageContent />
    </ConfiguratorProvider>
  );
}
