'use client';

import React, { useState } from 'react';
import { useConfigurator } from '@/contexts/configurator-context';
import type { ConfigurationSelections, ClientData } from '@/types';

interface SummaryStepProps {
  onSubmit: (clientData: ClientData, notes: string) => Promise<void>;
}

export default function SummaryStep({ onSubmit }: SummaryStepProps) {
  const { state } = useConfigurator();
  const [clientData, setClientData] = useState<ClientData>({
    name: '',
    phone: '',
    email: '',
  });
  const [notes, setNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!clientData.name.trim()) {
      newErrors.push('Name is required');
    }

    if (!clientData.phone.trim()) {
      newErrors.push('Phone number is required');
    }

    if (!clientData.email.trim()) {
      newErrors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(clientData.email)) {
        newErrors.push('Invalid email format');
      }
    }

    if (!termsAccepted) {
      newErrors.push('You must accept the terms and conditions');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      await onSubmit(clientData, notes);
      setSubmitSuccess(true);
    } catch (error: any) {
      setErrors([error.message || 'Failed to submit configuration. Please try again.']);
      setIsSubmitting(false);
    }
  };

  // Success state
  if (submitSuccess) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Configuration Submitted!</h2>
        <p className="text-lg text-gray-600 mb-2">
          Thank you for using our configurator.
        </p>
        <p className="text-gray-600 mb-8">
          We will review your {state.productType} configuration and contact you within 24-48 hours.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto mb-8">
          <p className="text-sm text-blue-900">
            A confirmation email has been sent to <strong>{clientData.email}</strong>
          </p>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => window.location.href = '/configurator'}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Start New Configuration
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const selections = state.configuration.selections;

  return (
    <div className="space-y-8">
      {/* Configuration Summary */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Configuration Summary</h3>
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
          {renderConfigurationSummary(selections, state.productType)}
        </div>
      </div>

      {/* Contact Information Form */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={clientData.name}
              onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={clientData.phone}
              onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+971 50 123 4567"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={clientData.email}
              onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any special requirements or preferences..."
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                I accept the terms and conditions <span className="text-red-500">*</span>
              </label>
              <p className="text-gray-500">
                By submitting this configuration, you agree to be contacted regarding your request.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
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

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Submit Configuration
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function renderConfigurationSummary(selections: ConfigurationSelections, productType: string | null) {
  const items: { label: string; value: any }[] = [];

  // Type and Size
  if (selections.typeAndSize) {
    items.push({
      label: 'Layout Type',
      value: selections.typeAndSize.layoutType,
    });
    if (selections.typeAndSize.dimensions) {
      const dims = selections.typeAndSize.dimensions;
      items.push({
        label: 'Dimensions',
        value: `${dims.length || '-'} × ${dims.width || '-'} × ${dims.height || '-'} ${dims.unit}`,
      });
    }
  }

  // Style
  if (selections.style) {
    items.push({ label: 'Style', value: selections.style });
  }

  // Corpus Material
  if (selections.corpusMaterial) {
    items.push({
      label: 'Corpus Material',
      value: `${selections.corpusMaterial.material}${selections.corpusMaterial.color ? ` (${selections.corpusMaterial.color})` : ''}`,
    });
  }

  // Facade Material
  if (selections.facadeMaterial) {
    items.push({
      label: 'Facade Material',
      value: `${selections.facadeMaterial.material} - ${selections.facadeMaterial.finish}${selections.facadeMaterial.color ? ` (${selections.facadeMaterial.color})` : ''}`,
    });
  }

  // Kitchen-specific
  if (productType === 'kitchen') {
    if (selections.countertop) {
      items.push({
        label: 'Countertop',
        value: `${selections.countertop.material} - ${selections.countertop.thickness}mm${selections.countertop.brand ? ` (${selections.countertop.brand})` : ''}`,
      });
    }

    if (selections.splashback) {
      items.push({
        label: 'Splashback',
        value: selections.splashback.material,
      });
    }

    if (selections.appliances && selections.appliances.length > 0) {
      items.push({
        label: 'Appliances',
        value: selections.appliances.map(a => `${a.type} (${a.integration})`).join(', '),
      });
    }
  }

  // Wardrobe-specific
  if (productType === 'wardrobe') {
    if (selections.doorType) {
      items.push({ label: 'Door Type', value: selections.doorType });
    }

    if (selections.doorMaterials && selections.doorMaterials.length > 0) {
      items.push({
        label: 'Door Materials',
        value: selections.doorMaterials.map(d => d.material).join(', '),
      });
    }

    if (selections.slidingSystem) {
      items.push({
        label: 'Sliding System',
        value: selections.slidingSystem.type,
      });
    }
  }

  // Hardware
  if (selections.hardware) {
    items.push({
      label: 'Hardware',
      value: `${selections.hardware.manufacturer} - Hinges: ${selections.hardware.hinges}, Slides: ${selections.hardware.drawerSlides}`,
    });
  }

  // Accessories
  if (selections.accessories && selections.accessories.length > 0) {
    items.push({
      label: 'Accessories',
      value: selections.accessories.map(a => a.type).join(', '),
    });
  }

  return items.map((item, index) => (
    <div key={index} className="px-6 py-4 flex justify-between items-center">
      <span className="font-medium text-gray-900">{item.label}</span>
      <span className="text-gray-600 capitalize">{String(item.value).replace(/_/g, ' ')}</span>
    </div>
  ));
}
