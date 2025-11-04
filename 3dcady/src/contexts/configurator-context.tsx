'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type {
  ConfiguratorState,
  ConfigurationSelections,
  ProductTypeName,
  OptionCategory,
  OptionValue,
} from '@/types';

const STORAGE_KEY = 'configurator_state';
const STATE_EXPIRY_DAYS = 7;

interface ConfiguratorContextType {
  state: ConfiguratorState;
  initializeWizard: (productType: ProductTypeName) => Promise<void>;
  updateSelection: (category: string, value: any) => void;
  navigateToStep: (stepIndex: number) => void;
  clearState: () => void;
  restoreSavedState: () => boolean;
  submitConfiguration: (clientData: any, notes?: string) => Promise<any>;
}

const ConfiguratorContext = createContext<ConfiguratorContextType | undefined>(undefined);

type ConfiguratorAction =
  | { type: 'INITIALIZE'; payload: { productType: ProductTypeName; categories: OptionCategory[] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CATEGORIES'; payload: OptionCategory[] }
  | { type: 'UPDATE_SELECTION'; payload: { category: string; value: any } }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_ERROR'; payload: { step: string; errors: string[] } }
  | { type: 'CLEAR_ERRORS'; payload: string }
  | { type: 'RESTORE_STATE'; payload: ConfiguratorState }
  | { type: 'CLEAR_STATE' };

const initialState: ConfiguratorState = {
  productType: null,
  currentStep: 0,
  totalSteps: 0,
  configuration: {
    productType: 'kitchen',
    selections: {},
  },
  optionsCache: {},
  categoriesCache: [],
  isLoading: false,
  errors: {},
};

function configuratorReducer(state: ConfiguratorState, action: ConfiguratorAction): ConfiguratorState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        productType: action.payload.productType,
        configuration: {
          productType: action.payload.productType,
          selections: {},
        },
        categoriesCache: action.payload.categories,
        totalSteps: action.payload.categories.length + 1, // +1 for summary step
        currentStep: 0,
        isLoading: false,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_CATEGORIES':
      return {
        ...state,
        categoriesCache: action.payload,
      };

    case 'UPDATE_SELECTION':
      return {
        ...state,
        configuration: {
          ...state.configuration,
          selections: {
            ...state.configuration.selections,
            [action.payload.category]: action.payload.value,
          },
        },
        savedStateTimestamp: Date.now(),
      };

    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.step]: action.payload.errors,
        },
      };

    case 'CLEAR_ERRORS':
      const newErrors = { ...state.errors };
      delete newErrors[action.payload];
      return {
        ...state,
        errors: newErrors,
      };

    case 'RESTORE_STATE':
      return {
        ...action.payload,
        isLoading: false,
      };

    case 'CLEAR_STATE':
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

export function ConfiguratorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(configuratorReducer, initialState);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (state.productType && state.savedStateTimestamp) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Error saving configurator state to localStorage:', error);
      }
    }
  }, [state]);

  // Initialize wizard with product type
  const initializeWizard = useCallback(async (productType: ProductTypeName) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Fetch option categories for this product type
      const response = await fetch(`/api/configurator/options?productType=${productType}`);
      
      if (!response.ok) {
        throw new Error('Failed to load configurator options');
      }

      const data = await response.json();
      
      dispatch({
        type: 'INITIALIZE',
        payload: {
          productType,
          categories: data.categories,
        },
      });
    } catch (error) {
      console.error('Error initializing wizard:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  }, []);

  // Update selection for a category
  const updateSelection = useCallback((category: string, value: any) => {
    dispatch({
      type: 'UPDATE_SELECTION',
      payload: { category, value },
    });
  }, []);

  // Navigate to specific step
  const navigateToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < state.totalSteps) {
      dispatch({ type: 'SET_STEP', payload: stepIndex });
    }
  }, [state.totalSteps]);

  // Clear state and localStorage
  const clearState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    dispatch({ type: 'CLEAR_STATE' });
  }, []);

  // Restore saved state from localStorage
  const restoreSavedState = useCallback((): boolean => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      
      if (!savedState) {
        return false;
      }

      const parsedState: ConfiguratorState = JSON.parse(savedState);

      // Check if state is expired
      if (parsedState.savedStateTimestamp) {
        const daysSinceLastSave = (Date.now() - parsedState.savedStateTimestamp) / (1000 * 60 * 60 * 24);
        
        if (daysSinceLastSave > STATE_EXPIRY_DAYS) {
          // State is too old, clear it
          localStorage.removeItem(STORAGE_KEY);
          return false;
        }
      }

      // Restore state
      dispatch({ type: 'RESTORE_STATE', payload: parsedState });
      return true;
    } catch (error) {
      console.error('Error restoring saved state:', error);
      return false;
    }
  }, []);

  // Submit configuration
  const submitConfiguration = useCallback(async (clientData: any, notes?: string) => {
    try {
      const response = await fetch('/api/configurator/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productType: state.productType,
          configurationData: {
            ...state.configuration,
            notes,
          },
          clientData,
          notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit configuration');
      }

      const result = await response.json();

      // Clear state after successful submission
      clearState();

      return result;
    } catch (error) {
      console.error('Error submitting configuration:', error);
      throw error;
    }
  }, [state.productType, state.configuration, clearState]);

  const value: ConfiguratorContextType = {
    state,
    initializeWizard,
    updateSelection,
    navigateToStep,
    clearState,
    restoreSavedState,
    submitConfiguration,
  };

  return (
    <ConfiguratorContext.Provider value={value}>
      {children}
    </ConfiguratorContext.Provider>
  );
}

export function useConfigurator() {
  const context = useContext(ConfiguratorContext);
  
  if (context === undefined) {
    throw new Error('useConfigurator must be used within a ConfiguratorProvider');
  }
  
  return context;
}
