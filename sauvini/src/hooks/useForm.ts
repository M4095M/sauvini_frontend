import { FormErrors } from "@/types/api";
import { useCallback, useRef, useState } from "react";

// T represent FormData
export interface UseFormConfig<T> {
  initialValues?: Partial<T>;
  validate?: (values: T) => Partial<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>({
  initialValues = {},
  validate: validateFn,
  onSubmit,
}: UseFormConfig<T>) {
  const refs = useRef<Record<string, HTMLInputElement | null>>({});
  const fileRefs = useRef<Record<string, File | null>>({});
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = useCallback(
    (name: keyof T) => ({
      ref: (el: HTMLInputElement | null) => {
        // Store reference
        refs.current[name as string] = el;

        // Set initial value
        if (el && initialValues[name]) {
          el.value = String(initialValues[name]);
        }
      },
      name: name as string,
    }),
    [initialValues]
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

  // Get all form values
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

    return values;
  }, []);

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
    const values = getValues();

    // Run validation before submission
    const isValid = validate(values);
    if (!isValid) {
      return; // Don't submit if validation fails
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values as T);
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
