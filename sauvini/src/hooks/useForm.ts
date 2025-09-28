import { FormErrors } from "@/types/api";
import { useCallback, useRef, useState } from "react";

// T represent FormData
export interface UseFormConfig<T> {
  initialValues?: Partial<T>;
  validate?: (values: T) => Partial<T>;
  onSubmit: (values: T) => Promise<void> | void;
  externalFormData?: React.MutableRefObject<Partial<T>>; // Add external form data ref
  onFormDataChange?: (formData: Partial<T>) => void; // Callback for form data changes
}

export function useForm<T extends Record<string, any>>({
  initialValues = {},
  validate: validateFn,
  onSubmit,
  externalFormData,
  onFormDataChange,
}: UseFormConfig<T>) {
  const refs = useRef<Record<string, HTMLInputElement | null>>({});
  const fileRefs = useRef<Record<string, File | null>>({});
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use external form data if provided, otherwise use initialValues
  const getCurrentFormData = useCallback(() => {
    return externalFormData?.current || initialValues;
  }, [externalFormData, initialValues]);

  const register = useCallback(
    (name: keyof T) => ({
      ref: (el: HTMLInputElement | null) => {
        // Store reference
        refs.current[name as string] = el;

        // Set initial value from external form data or initialValues
        if (el) {
          const currentFormData = getCurrentFormData();
          if (currentFormData[name]) {
            el.value = String(currentFormData[name]);
          }
        }
      },
      name: name as string,
    }),
    [getCurrentFormData]
  );

  // Register specifically for file inputs
  const registerFile = useCallback(
    (name: keyof T) => ({
      ref: (el: HTMLInputElement | null) => {
        refs.current[name as string] = el;
      },
      name: name as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        fileRefs.current[name as string] = file;
      },
    }),
    []
  );

  // Get all form values and update external form data if provided
  const getValues = useCallback((): Partial<T> => {
    const values = {} as T;

    // Get text input values
    Object.keys(refs.current).forEach((key) => {
      const input = refs.current[key];
      if (input) {
        values[key as keyof T] = input.value as T[keyof T];
      }
    });

    // Get file values
    Object.keys(fileRefs.current).forEach((key) => {
      const file = fileRefs.current[key];
      values[key as keyof T] = file as T[keyof T];
    });

    // Update external form data if provided
    if (externalFormData) {
      externalFormData.current = {
        ...externalFormData.current,
        ...values,
      };
    }

    // Call onFormDataChange callback if provided
    if (onFormDataChange) {
      onFormDataChange(values);
    }

    return values;
  }, [externalFormData, onFormDataChange]);

  // Get only files
  const getFiles = useCallback((): Record<string, File | null> => {
    return { ...fileRefs.current };
  }, []);

  // Validate function
  const validate = useCallback(
    (values?: Partial<T>) => {
      const formValues = values || getValues();

      if (validateFn && Object.keys(formValues).length > 0) {
        const validationErrors = validateFn(formValues as T);
        setErrors(validationErrors as FormErrors<T>);

        // Return true if no errors, false if there are errors
        return Object.keys(validationErrors).length === 0;
      }

      // Clear errors if no validation function provided
      setErrors({});
      return true;
    },
    [getValues, validateFn]
  );

  // Handle form submission with validation
  const handleSubmit = useCallback(async () => {
    const values = externalFormData?.current;

    // Run validation before submission
    const isValid = validate(values);
    if (!isValid) {
      return; // Don't submit if validation fails
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values as T);
      console.log("Form submitted successfully: ", values);
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [getValues, onSubmit, validate]);

  return {
    register,
    registerFile,
    handleSubmit,
    errors,
    setErrors,
    isSubmitting,
    getValues,
    getFiles,
    validate,
  };
}
