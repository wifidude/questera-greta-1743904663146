import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Navbar from './Navbar';

const ErrorFallback = ({ error }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <h3 className="text-lg font-medium text-red-800">Error loading content</h3>
    <p className="text-sm text-red-600">{error.message}</p>
  </div>
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]" />
  </div>
);

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default Layout;