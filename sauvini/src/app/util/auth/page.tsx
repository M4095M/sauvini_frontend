/**
 * Authentication Demo Page
 * 
 * This page demonstrates the complete authentication system including:
 * - API architecture usage
 * - Authentication context integration  
 * - Protected routes
 * - Error handling
 * - Token management
 * 
 * This is a comprehensive example for learning and testing purposes.
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LessonsApi, ApiUtils, ErrorHandlers } from '@/api';
import type { 
  LoginRequest, 
  RegisterStudentData,
  RegisterProfessorData,
  Module
} from '@/api';

// ===========================================
// COMPONENT TYPES
// ===========================================

interface AuthDemoState {
  activeTab: 'student-login' | 'professor-login' | 'admin-login' | 'student-register' | 'professor-register' | 'api-demo' | 'token-info';
  studentLoginForm: LoginRequest;
  professorLoginForm: LoginRequest;
  adminLoginForm: LoginRequest;
  studentRegisterForm: RegisterStudentData;
  professorRegisterForm: RegisterProfessorData & { cvFile: File | null; profilePicture: File | null };
  modules: Module[];
  apiLoading: boolean;
  apiError: string | null;
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function AuthDemoPage() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    loginStudent,
    loginProfessor,
    loginAdmin,
    logout,
    registerStudent,
    registerProfessor,
    getUserRole,
    error: authError,
    clearError,
  } = useAuth();

  // ===========================================
  // LOCAL STATE
  // ===========================================

  const [state, setState] = useState<AuthDemoState>({
    activeTab: 'student-login',
    studentLoginForm: {
      email: 'test@student.com',
      password: 'password123',
    },
    professorLoginForm: {
      email: 'test@professor.com',
      password: 'password123',
    },
    adminLoginForm: {
      email: 'admin@sauvini.com',
      password: 'admin123',
    },
    studentRegisterForm: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@student.com',
      password: 'password123',
      wilaya: 'Algiers',
      phone_number: '+213555000000',
      academic_stream: 'Computer Science',
    },
    professorRegisterForm: {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@professor.com',
      password: 'password123',
      wilaya: 'Oran',
      phone_number: '+213666000000',
      gender: 'female',
      date_of_birth: '1985-05-15',
      exp_school: true,
      exp_school_years: 5,
      exp_off_school: false,
      exp_online: true,
      cvFile: null,
      profilePicture: null,
    },
    modules: [],
    apiLoading: false,
    apiError: null,
  });

  // ===========================================
  // HANDLERS
  // ===========================================

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await loginStudent(
        state.studentLoginForm.email,
        state.studentLoginForm.password
      );
    } catch (error) {
      console.error('Student login failed:', error);
    }
  };

  const handleProfessorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await loginProfessor(
        state.professorLoginForm.email,
        state.professorLoginForm.password
      );
    } catch (error) {
      console.error('Professor login failed:', error);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await loginAdmin(
        state.adminLoginForm.email,
        state.adminLoginForm.password
      );
    } catch (error) {
      console.error('Admin login failed:', error);
    }
  };

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await registerStudent(state.studentRegisterForm);
    } catch (error) {
      console.error('Student registration failed:', error);
    }
  };

  const handleProfessorRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      if (!state.professorRegisterForm.cvFile) {
        setState(prev => ({ ...prev, apiError: 'CV file is required for professor registration' }));
        return;
      }

      await registerProfessor(
        state.professorRegisterForm,
        state.professorRegisterForm.cvFile,
        state.professorRegisterForm.profilePicture || undefined
      );
    } catch (error) {
      console.error('Professor registration failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleTestApiCall = async () => {
    setState(prev => ({ ...prev, apiLoading: true, apiError: null }));
    
    try {
      const response = await LessonsApi.getModules();
      
      if (response.success && response.data) {
        setState(prev => ({ ...prev, modules: response.data! }));
      } else {
        setState(prev => ({ ...prev, apiError: response.message || 'API call failed' }));
      }
    } catch (error: unknown) {
      const errorMessage = ErrorHandlers.getUserFriendlyMessage(error);
      setState(prev => ({ ...prev, apiError: errorMessage }));
    } finally {
      setState(prev => ({ ...prev, apiLoading: false }));
    }
  };

  const handleTestUnauthenticatedCall = async () => {
    setState(prev => ({ ...prev, apiLoading: true, apiError: null, apiResult: null }));
    
    try {
      // Example: Test an API call without authentication
      const result = await fetch('/api/public/status');
      const data = await result.json();
      setState(prev => ({ ...prev, apiResult: 'Unauthenticated API call: ' + JSON.stringify(data) }));
    } catch (error) {
      setState(prev => ({ ...prev, apiError: error instanceof Error ? error.message : 'Unknown error' }));
    } finally {
      setState(prev => ({ ...prev, apiLoading: false }));
    }
  };

  const updateStudentLoginForm = (field: string, value: string) => {
    setState(prev => ({
      ...prev,
      studentLoginForm: { ...prev.studentLoginForm, [field]: value },
    }));
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateProfessorRegisterForm('cvFile', file);
    }
  };

  const updateProfessorLoginForm = (field: string, value: string) => {
    setState(prev => ({
      ...prev,
      professorLoginForm: { ...prev.professorLoginForm, [field]: value },
    }));
  };

  const updateAdminLoginForm = (field: string, value: string) => {
    setState(prev => ({
      ...prev,
      adminLoginForm: { ...prev.adminLoginForm, [field]: value },
    }));
  };

  const updateStudentRegisterForm = (field: string, value: string | boolean | number) => {
    setState(prev => ({
      ...prev,
      studentRegisterForm: { ...prev.studentRegisterForm, [field]: value },
    }));
  };

  const updateProfessorRegisterForm = (field: string, value: string | boolean | number | File | null) => {
    setState(prev => ({
      ...prev,
      professorRegisterForm: { ...prev.professorRegisterForm, [field]: value },
    }));
  };

  const getUserDisplayName = () => {
    if (!user) return null;
    
    if ('first_name' in user && 'last_name' in user) {
      return `${user.first_name} ${user.last_name}`;
    }
    
    return user.email;
  };

  const getUserRoleDisplay = () => {
    const role = getUserRole();
    return role || 'Unknown';
  };

  // ===========================================
  // COMPONENT SECTIONS
  // ===========================================

  const renderAuthStatus = () => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Status:</span>
          <span className={`px-2 py-1 rounded text-sm ${
            isAuthenticated 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </span>
        </div>
        
        {user && (
          <>
            <div className="flex items-center space-x-2">
              <span className="font-medium">User:</span>
              <span>{getUserDisplayName()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Role:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                getUserRoleDisplay() === 'student' 
                  ? 'bg-blue-100 text-blue-800' 
                  : getUserRoleDisplay() === 'professor'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {getUserRoleDisplay()}
              </span>
            </div>
          </>
        )}
        
        <div className="flex items-center space-x-2">
          <span className="font-medium">Loading:</span>
          <span>{authLoading ? 'Yes' : 'No'}</span>
        </div>
        
        {authError && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-800 text-sm">{authError}</p>
          </div>
        )}
      </div>
      
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      )}
    </div>
  );

  const renderStudentLoginForm = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Student Login</h3>
      
      <form onSubmit={handleStudentLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={state.studentLoginForm.email}
            onChange={(e) => updateStudentLoginForm('email', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter student email"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={state.studentLoginForm.password}
            onChange={(e) => updateStudentLoginForm('password', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={authLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {authLoading ? 'Logging in...' : 'Login as Student'}
        </button>
      </form>
      
      <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
        <p className="font-medium">Test Student Credentials:</p>
        <p>Email: test@student.com</p>
        <p>Password: password123</p>
      </div>
    </div>
  );

  const renderProfessorLoginForm = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Professor Login</h3>
      
      <form onSubmit={handleProfessorLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={state.professorLoginForm.email}
            onChange={(e) => updateProfessorLoginForm('email', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter professor email"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={state.professorLoginForm.password}
            onChange={(e) => updateProfessorLoginForm('password', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter password"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={authLoading}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          {authLoading ? 'Logging in...' : 'Login as Professor'}
        </button>
      </form>
      
      <div className="mt-4 p-3 bg-purple-50 rounded text-sm">
        <p className="font-medium">Test Professor Credentials:</p>
        <p>Email: test@professor.com</p>
        <p>Password: password123</p>
      </div>
    </div>
  );

  const renderAdminLoginForm = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Admin Login</h3>
      
      <form onSubmit={handleAdminLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={state.adminLoginForm.email}
            onChange={(e) => updateAdminLoginForm('email', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Enter admin email"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={state.adminLoginForm.password}
            onChange={(e) => updateAdminLoginForm('password', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Enter admin password"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={authLoading}
          className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {authLoading ? 'Logging in...' : 'Login as Admin'}
        </button>
      </form>
      
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p className="font-medium">Test Admin Credentials:</p>
        <p>Email: admin@sauvini.com</p>
        <p>Password: admin123</p>
      </div>
    </div>
  );

  const renderStudentRegisterForm = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Student Registration</h3>
      
      <form onSubmit={handleStudentRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={state.studentRegisterForm.first_name}
              onChange={(e) => updateStudentRegisterForm('first_name', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={state.studentRegisterForm.last_name}
              onChange={(e) => updateStudentRegisterForm('last_name', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={state.studentRegisterForm.email}
            onChange={(e) => updateStudentRegisterForm('email', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={state.studentRegisterForm.password}
            onChange={(e) => updateStudentRegisterForm('password', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={state.studentRegisterForm.phone_number}
            onChange={(e) => updateStudentRegisterForm('phone_number', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wilaya
          </label>
          <input
            type="text"
            value={state.studentRegisterForm.wilaya}
            onChange={(e) => updateStudentRegisterForm('wilaya', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Academic Stream
          </label>
          <input
            type="text"
            value={state.studentRegisterForm.academic_stream}
            onChange={(e) => updateStudentRegisterForm('academic_stream', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={authLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {authLoading ? 'Registering...' : 'Register Student'}
        </button>
      </form>
      
      <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
        <p className="font-medium">Student Registration Demo</p>
        <p className="text-gray-600">Fill out all fields to test student registration</p>
      </div>
    </div>
  );

  const renderProfessorRegisterForm = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Professor Registration</h3>
      
      <form onSubmit={handleProfessorRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={state.professorRegisterForm.first_name}
              onChange={(e) => updateProfessorRegisterForm('first_name', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={state.professorRegisterForm.last_name}
              onChange={(e) => updateProfessorRegisterForm('last_name', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={state.professorRegisterForm.email}
            onChange={(e) => updateProfessorRegisterForm('email', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={state.professorRegisterForm.password}
            onChange={(e) => updateProfessorRegisterForm('password', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={state.professorRegisterForm.phone_number}
            onChange={(e) => updateProfessorRegisterForm('phone_number', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wilaya
          </label>
          <input
            type="text"
            value={state.professorRegisterForm.wilaya}
            onChange={(e) => updateProfessorRegisterForm('wilaya', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter wilaya"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={state.professorRegisterForm.gender}
            onChange={(e) => updateProfessorRegisterForm('gender', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={state.professorRegisterForm.date_of_birth}
            onChange={(e) => updateProfessorRegisterForm('date_of_birth', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Experience
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={state.professorRegisterForm.exp_school}
                onChange={(e) => updateProfessorRegisterForm('exp_school', e.target.checked)}
                className="mr-2"
              />
              School Experience
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={state.professorRegisterForm.exp_off_school}
                onChange={(e) => updateProfessorRegisterForm('exp_off_school', e.target.checked)}
                className="mr-2"
              />
              Off-School Experience
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={state.professorRegisterForm.exp_online}
                onChange={(e) => updateProfessorRegisterForm('exp_online', e.target.checked)}
                className="mr-2"
              />
              Online Experience
            </label>
          </div>
        </div>
        
        {state.professorRegisterForm.exp_school && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of School Experience
            </label>
            <input
              type="number"
              value={state.professorRegisterForm.exp_school_years || ''}
              onChange={(e) => updateProfessorRegisterForm('exp_school_years', parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="0"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CV Upload (Optional)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleCvUpload}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {state.professorRegisterForm.cvFile && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {state.professorRegisterForm.cvFile.name}
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={authLoading}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          {authLoading ? 'Registering...' : 'Register Professor'}
        </button>
      </form>
      
      <div className="mt-4 p-3 bg-purple-50 rounded text-sm">
        <p className="font-medium">Professor Registration Demo</p>
        <p className="text-gray-600">Includes optional CV file upload functionality</p>
      </div>
    </div>
  );

  const renderApiDemo = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">API Integration Demo</h3>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={handleTestApiCall}
            disabled={state.apiLoading || !isAuthenticated}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors mr-4"
          >
            {state.apiLoading ? 'Loading...' : 'Test Authenticated API Call (Get Modules)'}
          </button>
          
          <button
            onClick={handleTestUnauthenticatedCall}
            disabled={state.apiLoading}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            Test Unauthenticated Call
          </button>
        </div>
        
        {state.apiError && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-800 text-sm font-medium">API Error:</p>
            <p className="text-red-700 text-sm">{state.apiError}</p>
          </div>
        )}
        
        {state.modules.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-800 text-sm font-medium">API Success:</p>
            <p className="text-green-700 text-sm">Fetched {state.modules.length} modules</p>
            <div className="mt-2 max-h-32 overflow-y-auto">
              {state.modules.map((module, index) => (
                <div key={index} className="text-xs text-gray-600 border-b py-1">
                  {module.title} - {module.description}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-blue-800 text-sm font-medium">How it works:</p>
          <ul className="text-blue-700 text-sm mt-1 list-disc list-inside space-y-1">
            <li>Authenticated calls automatically include JWT tokens</li>
            <li>Expired tokens are refreshed automatically</li>
            <li>Failed auth redirects to login page</li>
            <li>Error handling provides user-friendly messages</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderTokenInfo = () => {
    const tokens = ApiUtils.isAuthenticated() ? 'Valid' : 'Invalid/Missing';
    const userRole = ApiUtils.getCurrentUserRole();
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Token & State Information</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Token Status:</span>
            <span className={tokens === 'Valid' ? 'text-green-600' : 'text-red-600'}>
              {tokens}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">User Role (from token):</span>
            <span className="text-gray-700">{userRole || 'None'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Is Student:</span>
            <span className="text-gray-700">{ApiUtils.hasRole('student') ? 'Yes' : 'No'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Is Professor:</span>
            <span className="text-gray-700">{ApiUtils.hasRole('professor') ? 'Yes' : 'No'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Auth Loading:</span>
            <span className="text-gray-700">{authLoading ? 'Yes' : 'No'}</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
          <p className="font-medium mb-2">Technical Details:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Tokens stored in localStorage with &apos;sauvini_auth_tokens&apos; key</li>
            <li>Automatic refresh 30 seconds before expiration</li>
            <li>JWT payload decoded for role information</li>
            <li>Context state synchronized with API state</li>
          </ul>
        </div>
      </div>
    );
  };

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Authentication System Demo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This page demonstrates the complete authentication architecture including 
            BaseApi class, AuthApi, AuthContext integration, token management, and error handling.
          </p>
        </div>
        
        {/* Auth Status */}
        {renderAuthStatus()}
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {([
                { id: 'student-login', label: 'Student Login' },
                { id: 'professor-login', label: 'Professor Login' },
                { id: 'admin-login', label: 'Admin Login' },
                { id: 'student-register', label: 'Student Register' },
                { id: 'professor-register', label: 'Professor Register' },
                { id: 'api-demo', label: 'API Integration' },
                { id: 'token-info', label: 'Token Info' },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setState(prev => ({ ...prev, activeTab: tab.id }))}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    state.activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {state.activeTab === 'student-login' && renderStudentLoginForm()}
            {state.activeTab === 'professor-login' && renderProfessorLoginForm()}
            {state.activeTab === 'admin-login' && renderAdminLoginForm()}
            {state.activeTab === 'student-register' && renderStudentRegisterForm()}
            {state.activeTab === 'professor-register' && renderProfessorRegisterForm()}
            {state.activeTab === 'api-demo' && renderApiDemo()}
            {state.activeTab === 'token-info' && renderTokenInfo()}
          </div>
          
          {/* Documentation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Architecture Overview</h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">BaseApi Class</h4>
                <p className="text-gray-600">
                  Provides HTTP methods (GET, POST, PUT, DELETE) with built-in authentication 
                  middleware, token refresh, and error handling.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">AuthApi Class</h4>
                <p className="text-gray-600">
                  Extends BaseApi to handle login, registration, logout, and user management. 
                  Automatically manages token storage.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">AuthContext</h4>
                <p className="text-gray-600">
                  React context providing centralized authentication state, user data, 
                  and auth-related functions throughout the app.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">ProtectedRoute</h4>
                <p className="text-gray-600">
                  Component for protecting routes based on authentication status and user roles. 
                  Handles redirects and access control.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Token Management</h4>
                <p className="text-gray-600">
                  Automatic token refresh, localStorage persistence, expiration handling, 
                  and seamless API integration.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-3 bg-blue-50 rounded text-sm">
              <p className="font-medium text-blue-900 mb-1">Next Steps:</p>
              <ul className="text-blue-800 list-disc list-inside space-y-1">
                <li>Connect to your backend API</li>
                <li>Update API base URL in environment variables</li>
                <li>Customize user types and API responses</li>
                <li>Integrate with your existing pages</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}