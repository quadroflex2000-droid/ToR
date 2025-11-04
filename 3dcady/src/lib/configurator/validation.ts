import type { ConfigurationSelections, ProductTypeName, ConditionalLogic } from '@/types';

/**
 * Validation rules for configurator steps
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate Type and Size step
 */
export function validateTypeAndSize(selections: ConfigurationSelections): ValidationResult {
  const errors: string[] = [];

  if (!selections.typeAndSize) {
    errors.push('Type and size selection is required');
    return { isValid: false, errors };
  }

  if (!selections.typeAndSize.layoutType) {
    errors.push('Layout type is required');
  }

  if (!selections.typeAndSize.dimensions) {
    errors.push('Dimensions are required');
  } else {
    const { dimensions } = selections.typeAndSize;
    
    if (!dimensions.unit) {
      errors.push('Dimension unit is required');
    }

    // Validate dimension values
    if (dimensions.length && dimensions.length < 100) {
      errors.push('Length must be at least 100mm');
    }

    if (dimensions.width && dimensions.width < 100) {
      errors.push('Width must be at least 100mm');
    }

    if (dimensions.height && dimensions.height < 100) {
      errors.push('Height must be at least 100mm');
    }

    // Kitchen-specific validation
    if (selections.typeAndSize.layoutType === 'island' && dimensions.length && dimensions.length < 3000) {
      errors.push('Island kitchen requires minimum length of 3000mm');
    }

    // Wardrobe-specific validation for sliding doors
    if (selections.doorType === 'sliding' && dimensions.width && dimensions.width < 1200) {
      errors.push('Sliding door system requires minimum width of 1200mm');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Style step
 */
export function validateStyle(selections: ConfigurationSelections): ValidationResult {
  const errors: string[] = [];

  if (!selections.style) {
    errors.push('Style selection is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Materials step (Corpus and Facade)
 */
export function validateMaterials(selections: ConfigurationSelections): ValidationResult {
  const errors: string[] = [];

  if (!selections.corpusMaterial) {
    errors.push('Corpus material is required');
  } else {
    if (!selections.corpusMaterial.material) {
      errors.push('Corpus material type is required');
    }
  }

  if (!selections.facadeMaterial) {
    errors.push('Facade material is required');
  } else {
    if (!selections.facadeMaterial.material) {
      errors.push('Facade material type is required');
    }
    if (!selections.facadeMaterial.finish) {
      errors.push('Facade finish is required');
    }
    if (!selections.facadeMaterial.color) {
      errors.push('Facade color is required');
    }
    if (!selections.facadeMaterial.profile) {
      errors.push('Facade profile is required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Countertop step (Kitchen only)
 */
export function validateCountertop(selections: ConfigurationSelections): ValidationResult {
  const errors: string[] = [];

  if (!selections.countertop) {
    errors.push('Countertop selection is required');
  } else {
    if (!selections.countertop.material) {
      errors.push('Countertop material is required');
    }
    if (!selections.countertop.thickness) {
      errors.push('Countertop thickness is required');
    }
  }

  if (!selections.splashback) {
    errors.push('Splashback selection is required');
  } else {
    if (!selections.splashback.material) {
      errors.push('Splashback material is required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Hardware step
 */
export function validateHardware(selections: ConfigurationSelections): ValidationResult {
  const errors: string[] = [];

  if (!selections.hardware) {
    errors.push('Hardware selection is required');
  } else {
    if (!selections.hardware.hinges) {
      errors.push('Hinge type is required');
    }
    if (!selections.hardware.drawerSlides) {
      errors.push('Drawer slide type is required');
    }
    if (!selections.hardware.manufacturer) {
      errors.push('Hardware manufacturer is required');
    }

    // Wardrobe with hinged doors requires handle selection
    if (selections.doorType === 'hinged' && !selections.hardware.handles) {
      errors.push('Handle type is required for hinged doors');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Wardrobe door configuration
 */
export function validateWardrobeDoors(selections: ConfigurationSelections): ValidationResult {
  const errors: string[] = [];

  if (!selections.doorType) {
    errors.push('Door type is required');
  }

  if (!selections.doorMaterials || selections.doorMaterials.length === 0) {
    errors.push('At least one door material must be selected');
  }

  // Validate sliding system for sliding doors
  if (selections.doorType === 'sliding') {
    if (!selections.slidingSystem) {
      errors.push('Sliding system configuration is required');
    } else {
      if (!selections.slidingSystem.type) {
        errors.push('Sliding system type is required');
      }
      if (!selections.slidingSystem.profileColor) {
        errors.push('Profile color is required');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Wardrobe internal filling
 */
export function validateInternalFilling(selections: ConfigurationSelections): ValidationResult {
  const errors: string[] = [];

  if (!selections.internalFilling || selections.internalFilling.length === 0) {
    errors.push('Internal filling configuration is required');
  } else {
    // Validate each section
    selections.internalFilling.forEach((section, index) => {
      if (!section.sectionWidth || section.sectionWidth <= 0) {
        errors.push(`Section ${index + 1}: Width is required and must be greater than 0`);
      }

      if (!section.elements || section.elements.length === 0) {
        errors.push(`Section ${index + 1}: At least one filling element is required`);
      }

      // Validate pantograph height requirement
      section.elements.forEach((element) => {
        if (element.type === 'pantograph') {
          const wardrobeHeight = selections.typeAndSize?.dimensions?.height || 0;
          if (wardrobeHeight < 1800) {
            errors.push(`Pantograph requires minimum wardrobe height of 1800mm`);
          }
        }
      });
    });

    // Validate total width doesn't exceed wardrobe width
    const totalWidth = selections.internalFilling.reduce((sum, section) => sum + section.sectionWidth, 0);
    const wardrobeWidth = selections.typeAndSize?.dimensions?.width || 0;
    if (totalWidth > wardrobeWidth) {
      errors.push(`Total section width (${totalWidth}mm) exceeds wardrobe width (${wardrobeWidth}mm)`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Evaluate conditional logic for showing/hiding categories
 */
export function evaluateConditionalLogic(
  conditionalDisplay: ConditionalLogic | null | undefined,
  selections: ConfigurationSelections
): boolean {
  if (!conditionalDisplay) {
    return true; // No conditions means always show
  }

  // Evaluate showIf conditions
  if (conditionalDisplay.showIf) {
    const showConditionsMet = conditionalDisplay.showIf.every((condition) => {
      const fieldValue = getFieldValue(selections, condition.field);
      return evaluateCondition(fieldValue, condition.operator, condition.value);
    });

    if (!showConditionsMet) {
      return false;
    }
  }

  // Evaluate hideIf conditions
  if (conditionalDisplay.hideIf) {
    const hideConditionsMet = conditionalDisplay.hideIf.some((condition) => {
      const fieldValue = getFieldValue(selections, condition.field);
      return evaluateCondition(fieldValue, condition.operator, condition.value);
    });

    if (hideConditionsMet) {
      return false;
    }
  }

  return true;
}

/**
 * Get field value from selections using dot notation
 */
function getFieldValue(selections: ConfigurationSelections, fieldPath: string): any {
  const parts = fieldPath.split('.');
  let value: any = selections;

  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part as keyof typeof value];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Evaluate a single condition
 */
function evaluateCondition(fieldValue: any, operator: string, targetValue: any): boolean {
  switch (operator) {
    case 'equals':
      return fieldValue === targetValue;
    
    case 'notEquals':
      return fieldValue !== targetValue;
    
    case 'in':
      return Array.isArray(targetValue) && targetValue.includes(fieldValue);
    
    case 'notIn':
      return Array.isArray(targetValue) && !targetValue.includes(fieldValue);
    
    default:
      return false;
  }
}

/**
 * Validate complete configuration before submission
 */
export function validateCompleteConfiguration(
  selections: ConfigurationSelections,
  productType: ProductTypeName
): ValidationResult {
  const allErrors: string[] = [];

  // Common validations
  const typeAndSizeResult = validateTypeAndSize(selections);
  allErrors.push(...typeAndSizeResult.errors);

  const styleResult = validateStyle(selections);
  allErrors.push(...styleResult.errors);

  const materialsResult = validateMaterials(selections);
  allErrors.push(...materialsResult.errors);

  const hardwareResult = validateHardware(selections);
  allErrors.push(...hardwareResult.errors);

  // Product-specific validations
  if (productType === 'kitchen') {
    const countertopResult = validateCountertop(selections);
    allErrors.push(...countertopResult.errors);
  }

  if (productType === 'wardrobe') {
    const doorsResult = validateWardrobeDoors(selections);
    allErrors.push(...doorsResult.errors);

    const fillingResult = validateInternalFilling(selections);
    allErrors.push(...fillingResult.errors);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}
