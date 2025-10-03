'use client';

import { useEffect, useState } from 'react';

/**
 * Environment Variables Verification Page
 * This page displays all NEXT_PUBLIC_ environment variables to verify they're being read correctly
 */
export default function EnvVerificationPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [apiUrl, setApiUrl] = useState<string>('');

  useEffect(() => {
    // Get all NEXT_PUBLIC_ environment variables from process.env
    const publicEnvVars: Record<string, string> = {};
    
    // Add the API URL and Images Prefix
    publicEnvVars.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'NOT SET';
    publicEnvVars.NEXT_PUBLIC_IMAGES_PREFIX = process.env.NEXT_PUBLIC_IMAGES_PREFIX || 'NOT SET';
    
    setEnvVars(publicEnvVars);
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'NOT SET');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Environment Variables Verification
          </h1>
          
          <div className="space-y-6">
            {/* API URL Section */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                API Configuration
              </h2>
              <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                <div className="mb-2">
                  <span className="text-gray-600">NEXT_PUBLIC_API_URL:</span>
                  <span className={`ml-2 font-bold ${apiUrl === 'NOT SET' ? 'text-red-600' : 'text-green-600'}`}>
                    {apiUrl}
                  </span>
                </div>
              </div>
            </div>

            {/* All Environment Variables */}
            <div className="border-l-4 border-green-500 pl-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                All NEXT_PUBLIC_ Variables
              </h2>
              <div className="bg-gray-100 p-4 rounded font-mono text-sm space-y-2">
                {Object.entries(envVars).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-gray-600">{key}:</span>
                    <span className={`ml-2 font-bold ${value === 'NOT SET' ? 'text-red-600' : 'text-green-600'}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Indicator */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Status
              </h2>
              <div className="flex items-center space-x-2">
                {apiUrl !== 'NOT SET' ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-semibold">
                      ✓ Environment variables are loaded correctly
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-600 font-semibold">
                      ✗ Environment variables are NOT loaded
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="border-l-4 border-yellow-500 pl-4 mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Important Notes
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Environment variables must be prefixed with <code className="bg-gray-200 px-2 py-1 rounded">NEXT_PUBLIC_</code> to be accessible in the browser</li>
                <li>Changes to .env files require a server restart</li>
                <li>Check .env.local, .env files in the project root</li>
                <li>Current files loaded: .env.local, .env</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
