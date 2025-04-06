import React from 'react';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Navbar from './Navbar';
import { componentLogger } from '../utils/debugLogger';

const ErrorFallback = ({ error }) => {
  componentLogger.error('Layout Error', error.message, {
    stack: error.stack,
    componentStack: error.componentStack
  });
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-lg font-medium text-red-800">Error loading content</h3>
      <p className="text-sm text-red-600">{error.message}</p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-2 text-xs text-red-500 overflow-auto">
          {error.stack}
        </pre>
      )}
    </div>
  );
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]" />
  </div>
);

const Layout = ({ children }) => {
  componentLogger.debug('Layout Render');
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, errorInfo) => {
          componentLogger.error('Layout ErrorBoundary', error.message, {
            error,
            errorInfo
          });
        }}
      >
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
          <Outlet />
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default Layout;