/**
 * Simple API Usage Examples Component
 * 
 * This component shows practical examples of how to use the API classes
 * in real components, demonstrating best practices and patterns.
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LessonsApi, ErrorHandlers } from '@/api';
import type { Module, Lesson } from '@/api';

interface ApiExamplesState {
  modules: Module[];
  selectedModule: Module | null;
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
}

export function ApiUsageExamples() {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<ApiExamplesState>({
    modules: [],
    selectedModule: null,
    lessons: [],
    loading: false,
    error: null,
  });

  // Example: Load modules on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadModules();
    }
  }, [isAuthenticated]);

  // Example: API call with error handling
  const loadModules = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await LessonsApi.getModules();
      
      if (response.success && response.data) {
        setState(prev => ({ ...prev, modules: response.data! }));
      } else {
        throw new Error(response.message || 'Failed to load modules');
      }
    } catch (error) {
      const errorMessage = ErrorHandlers.getUserFriendlyMessage(error);
      setState(prev => ({ ...prev, error: errorMessage }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Example: Dependent API call
  const loadLessonsForModule = async (module: Module) => {
    setState(prev => ({ 
      ...prev, 
      selectedModule: module,
      loading: true, 
      error: null 
    }));
    
    try {
      const response = await LessonsApi.getChapters(module.id);
      
      if (response.success && response.data) {
        // In a real app, you'd load lessons for each chapter
        setState(prev => ({ 
          ...prev, 
          lessons: [], // Would be populated with actual lessons
        }));
      } else {
        throw new Error(response.message || 'Failed to load lessons');
      }
    } catch (error) {
      const errorMessage = ErrorHandlers.getUserFriendlyMessage(error);
      setState(prev => ({ ...prev, error: errorMessage }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Example: Optimistic update with error handling
  const markLessonComplete = async (lessonId: string) => {
    try {
      // Optimistic update
      setState(prev => ({
        ...prev,
        lessons: prev.lessons.map(lesson =>
          lesson.id === lessonId 
            ? { ...lesson, isCompleted: true }
            : lesson
        )
      }));

      const response = await LessonsApi.markLessonComplete(lessonId);
      
      if (!response.success || !response.data) {
        // Revert optimistic update on failure
        setState(prev => ({
          ...prev,
          lessons: prev.lessons.map(lesson =>
            lesson.id === lessonId 
              ? { ...lesson, isCompleted: false }
              : lesson
          )
        }));
        throw new Error(response.message || 'Failed to mark lesson complete');
      }
    } catch (error) {
      const errorMessage = ErrorHandlers.getUserFriendlyMessage(error);
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please log in to see API usage examples.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">API Usage Examples</h3>
        
        {/* Loading State */}
        {state.loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-gray-600">Loading...</span>
          </div>
        )}
        
        {/* Error State */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
            <p className="text-red-800 text-sm">{state.error}</p>
            <button
              onClick={() => setState(prev => ({ ...prev, error: null }))}
              className="text-red-600 text-xs underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* Modules List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Available Modules</h4>
            <button
              onClick={loadModules}
              disabled={state.loading}
              className="text-blue-600 text-sm hover:underline disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
          
          {state.modules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.modules.map((module) => (
                <div
                  key={module.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer"
                  onClick={() => loadLessonsForModule(module)}
                >
                  <h5 className="font-medium text-gray-900">{module.title}</h5>
                  <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {module.lessonsCount} lessons
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      module.isCompleted 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {module.isCompleted ? 'Completed' : `${module.progress}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !state.loading && (
              <div className="text-center py-8 text-gray-500">
                <p>No modules available or failed to load.</p>
                <p className="text-sm mt-1">
                  This is expected in demo mode without a backend.
                </p>
              </div>
            )
          )}
        </div>
        
        {/* Selected Module Details */}
        {state.selectedModule && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium mb-2">
              Selected: {state.selectedModule.title}
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Lessons would be loaded here using the LessonsApi.getLessons() method.
            </p>
            
            {/* Example lesson actions */}
            <div className="space-y-2">
              <button
                onClick={() => markLessonComplete('demo-lesson-1')}
                className="block w-full text-left px-3 py-2 bg-gray-50 rounded hover:bg-gray-100 text-sm"
              >
                📚 Demo Lesson 1 - Click to mark complete
              </button>
              <button
                onClick={() => markLessonComplete('demo-lesson-2')}
                className="block w-full text-left px-3 py-2 bg-gray-50 rounded hover:bg-gray-100 text-sm"
              >
                📝 Demo Lesson 2 - Click to mark complete
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Code Examples */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-medium mb-4">Code Examples</h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Basic API Call with Error Handling:
            </h5>
            <pre className="bg-gray-100 rounded p-3 text-xs overflow-x-auto">
{`const loadModules = async () => {
  try {
    const response = await LessonsApi.getModules();
    if (response.success) {
      setModules(response.data);
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    const message = ErrorHandlers.getUserFriendlyMessage(error);
    setError(message);
  }
};`}
            </pre>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Using Authentication Context:
            </h5>
            <pre className="bg-gray-100 rounded p-3 text-xs overflow-x-auto">
{`const { user, isAuthenticated, login, logout } = useAuth();

// Check auth status
if (!isAuthenticated) {
  return <LoginPrompt />;
}

// Use user data
const userName = user.firstName + ' ' + user.lastName;`}
            </pre>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Protected Route Usage:
            </h5>
            <pre className="bg-gray-100 rounded p-3 text-xs overflow-x-auto">
{`// Protect any authenticated user
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// Protect for specific role
<ProtectedRoute requiredRole="professor">
  <AdminPanel />
</ProtectedRoute>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}