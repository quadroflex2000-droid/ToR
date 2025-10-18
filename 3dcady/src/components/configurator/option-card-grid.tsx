'use client';

import React from 'react';
import OptionCard from './option-card';
import type { OptionValue } from '@/types';

interface OptionCardGridProps {
  options: OptionValue[];
  selectedOptions: OptionValue | OptionValue[];
  onSelect: (option: OptionValue) => void;
  allowMultiple?: boolean;
  columns?: 2 | 3 | 4;
}

export default function OptionCardGrid({
  options,
  selectedOptions,
  onSelect,
  allowMultiple = false,
  columns = 3,
}: OptionCardGridProps) {
  // Helper to check if option is selected
  const isSelected = (option: OptionValue): boolean => {
    if (Array.isArray(selectedOptions)) {
      return selectedOptions.some(selected => selected.id === option.id);
    }
    return selectedOptions?.id === option.id;
  };

  // Grid columns class based on prop
  const gridColsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${gridColsClass} gap-4 sm:gap-6`}>
      {options.map((option) => (
        <OptionCard
          key={option.id}
          option={option}
          isSelected={isSelected(option)}
          onSelect={onSelect}
          variant={allowMultiple ? 'multiple' : 'single'}
        />
      ))}
    </div>
  );
}
