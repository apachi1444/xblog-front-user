import type { FieldErrors, FieldValues } from 'react-hook-form';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

/**
 * A hook to handle form errors and display them as toast notifications
 * @param errors The form errors object from react-hook-form
 * @param shouldShowToast Whether to show toast notifications for errors
 */
export function useFormErrorHandler<T extends FieldValues>(
  errors: FieldErrors<T>,
  shouldShowToast: boolean = true
) {
  useEffect(() => {
    // Check if there are any errors
    if (Object.keys(errors).length > 0 && shouldShowToast) {
      // Get the first error message
      const firstError = Object.values(errors)[0];
      const errorMessage = firstError?.message as string;
      
      if (errorMessage) {
        // Show toast with error message
        toast.error(errorMessage);
      }
    }
  }, [errors, shouldShowToast]);

  return null;
}