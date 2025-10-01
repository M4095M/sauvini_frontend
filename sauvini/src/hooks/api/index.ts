/**
 * API Hooks Module Exports
 * 
 * This file provides convenient access to all API hooks for React components.
 * These hooks provide easy state management and error handling for API operations.
 * 
 * Example usage:
 * ```typescript
 * import { useAuth, useStudent, useProfessor, useAdmin } from '@/hooks/api';
 * 
 * function LoginComponent() {
 *   const { loginStudent, loading, error } = useAuth();
 *   // ... component logic
 * }
 * ```
 */

// ===========================================
// API HOOKS
// ===========================================

export { useAuth, useAuthStatus } from './useAuth';
export { useAdmin } from './useAdmin';
export { useProfessor } from './useProfessor';
export { useStudent } from './useStudent';

// ===========================================
// HOOK UTILITIES
// ===========================================

/**
 * Common hook patterns and utilities
 */
export const HookUtils = {
  /**
   * Helper to handle common async operation patterns
   * @param operation - Async operation to execute
   * @param onSuccess - Success callback
   * @param onError - Error callback
   */
  handleAsyncOperation: async <T>(
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: string) => void
  ): Promise<T | null> => {
    try {
      const result = await operation();
      if (onSuccess && result !== null) {
        onSuccess(result);
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      if (onError) {
        onError(errorMessage);
      }
      return null;
    }
  },

  /**
   * Helper to create a debounced version of an async function
   * Useful for search inputs and other frequent operations
   * @param fn - Function to debounce
   * @param delay - Delay in milliseconds
   */
  debounce: <T extends (...args: any[]) => any>(fn: T, delay: number): T => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    }) as T;
  },

  /**
   * Helper to format API errors for user display
   * @param error - Error object or string
   * @returns User-friendly error message
   */
  formatError: (error: unknown): string => {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String((error as { message: unknown }).message);
    }
    
    return 'An unexpected error occurred';
  },

  /**
   * Helper to handle pagination state
   * @param initialPage - Initial page number
   * @param initialLimit - Initial items per page
   */
  usePagination: (initialPage: number = 1, initialLimit: number = 10) => {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    
    const nextPage = useCallback(() => setPage(prev => prev + 1), []);
    const prevPage = useCallback(() => setPage(prev => Math.max(1, prev - 1)), []);
    const resetPage = useCallback(() => setPage(1), []);
    const goToPage = useCallback((newPage: number) => setPage(Math.max(1, newPage)), []);
    
    return {
      page,
      limit,
      setPage,
      setLimit,
      nextPage,
      prevPage,
      resetPage,
      goToPage,
      pagination: { page, limit }
    };
  }
};

// Import React hooks for the utility functions
import { useState, useCallback } from 'react';