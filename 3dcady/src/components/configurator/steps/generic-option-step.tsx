'use client';

import React from 'react';
import OptionCardGrid from '../option-card-grid';
import type { OptionCategory, OptionValue } from '@/types';

interface GenericOptionStepProps {
  category: OptionCategory;
  selectedValue: any;
  onSelect: (value: any) => void;
}

export default function GenericOptionStep({
  category,
  selectedValue,
  onSelect,
}: GenericOptionStepProps) {
  const options = category.options || [];

  const handleOptionSelect = (option: OptionValue) => {
    if (category.allowsMultiple) {
      // Multi-select logic
      const currentSelections = Array.isArray(selectedValue) ? selectedValue : [];
      const isSelected = currentSelections.some((item: OptionValue) => item.id === option.id);
      
      if (isSelected) {
        // Remove from selection
        onSelect(currentSelections.filter((item: OptionValue) => item.id !== option.id));
      } else {
        // Add to selection
        onSelect([...currentSelections, option]);
      }
    } else {
      // Single select
      onSelect(option);
    }
  };

  if (options.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No options available</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please contact support if this issue persists.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category description if available */}
      {category.name && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                {category.allowsMultiple 
                  ? 'You can select multiple options for this step.' 
                  : 'Please select one option to continue.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Options grid */}
      <OptionCardGrid
        options={options}
        selectedOptions={selectedValue || (category.allowsMultiple ? [] : null)}
        onSelect={handleOptionSelect}
        allowMultiple={category.allowsMultiple}
        columns={3}
      />

      {/* Selection count for multiple */}
      {category.allowsMultiple && Array.isArray(selectedValue) && selectedValue.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          {selectedValue.length} option{selectedValue.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}
