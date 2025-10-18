'use client';

import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import type { OptionValue } from '@/types';

interface OptionCardProps {
  option: OptionValue;
  isSelected: boolean;
  onSelect: (option: OptionValue) => void;
  variant?: 'single' | 'multiple';
}

export default function OptionCard({
  option,
  isSelected,
  onSelect,
  variant = 'single',
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option)}
      className={`relative flex flex-col h-full rounded-lg border-2 transition-all duration-200 ${
        isSelected
          ? 'border-blue-600 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    >
      {/* Image */}
      {option.imageUrl && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-gray-100">
          <img
            src={option.imageUrl}
            alt={option.name}
            className="w-full h-full object-cover"
          />
          {/* Selection Indicator Overlay */}
          {isSelected && (
            <div className="absolute top-2 right-2">
              <CheckCircleIcon className="h-8 w-8 text-blue-600 drop-shadow-md" />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-4">
        <h3 className={`text-lg font-semibold mb-2 ${
          isSelected ? 'text-blue-900' : 'text-gray-900'
        }`}>
          {option.name}
        </h3>
        
        {option.description && (
          <p className={`text-sm ${
            isSelected ? 'text-blue-700' : 'text-gray-600'
          } line-clamp-3`}>
            {option.description}
          </p>
        )}

        {/* Specifications or Price Factor */}
        {option.specifications && (
          <div className="mt-3 space-y-1">
            {Object.entries(option.specifications).slice(0, 3).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                <span className={isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        )}

        {option.priceFactor && option.priceFactor > 1 && (
          <div className="mt-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            Premium Option
          </div>
        )}
      </div>
    </button>
  );
}
