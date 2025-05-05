import type { UseFormReturn } from 'react-hook-form';

import { useEffect } from 'react';

/**
 * Hook to synchronize values between different form instances
 * This ensures that when a field is updated in one form, it's reflected in all other forms
 */
export const useFormSynchronization = (
  mainForm: UseFormReturn<any>,
  stepForms: UseFormReturn<any>[],
  fieldMappings: Record<string, string[]> = {}
) => {
  // Watch for changes in the main form and update step forms
  useEffect(() => {
    const subscription = mainForm.watch((value, { name, type }) => {
      if (!name || type !== 'change') return;
      
      // Find which step forms need to be updated based on the field name
      // eslint-disable-next-line no-restricted-syntax
      for (const [mainField, stepFields] of Object.entries(fieldMappings)) {
        if (name === mainField || name.startsWith(`${mainField}.`)) {
          // Get the value from the main form
          const fieldValue = mainForm.getValues(name);
          
          // Update each step form that contains this field
          stepFields.forEach((stepField, index) => {
            if (stepForms[index]) {
              // Only update if the value is different to avoid infinite loops
              const currentStepValue = stepForms[index].getValues(stepField);
              if (JSON.stringify(currentStepValue) !== JSON.stringify(fieldValue)) {
                console.log(`Syncing field ${name} from main form to ${stepField} in step form ${index}`, fieldValue);
                stepForms[index].setValue(stepField, fieldValue, {
                  shouldValidate: false,
                  shouldDirty: true,
                  shouldTouch: true
                });
              }
            }
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [mainForm, stepForms, fieldMappings]);

  // Function to update a field in all forms
  const updateFieldInAllForms = (fieldName: string, value: any) => {
    console.log(`Updating field ${fieldName} in all forms:`, value);
    
    // Update in main form
    mainForm.setValue(fieldName, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
    
    // Find which step forms need to be updated
    // eslint-disable-next-line no-restricted-syntax
    for (const [mainField, stepFields] of Object.entries(fieldMappings)) {
      if (fieldName === mainField || fieldName.startsWith(`${mainField}.`)) {
        // Update each step form that contains this field
        stepFields.forEach((stepField, index) => {
          if (stepForms[index]) {
            console.log(`Updating ${stepField} in step form ${index}`);
            stepForms[index].setValue(stepField, value, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true
            });
          }
        });
      }
    }
  };

  return {
    updateFieldInAllForms
  };
};
