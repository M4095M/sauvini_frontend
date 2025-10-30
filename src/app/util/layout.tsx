import Link from 'next/link';

/**
 * Layout for utility/demo pages
 * 
 * This layout wraps utility and demo pages with the necessary providers
 * and common structure. It ensures that authentication context is available
 * for demo pages.
 */

import { AuthProvider } from '@/context/AuthContext';

interface UtilLayoutProps {
  children: React.ReactNode;
}

export default function UtilLayout({ children }: UtilLayoutProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  Sauvini API Demo
                </h1>
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                  <span>•</span>
                  <span>Development & Testing Environment</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link
                  href="/util/auth"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Auth Demo
                </Link>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  Back to App
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Main Content */}
        <main>
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">
              This is a development demo page. Not for production use.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Sauvini Learning Platform - API Architecture Demo
            </p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}