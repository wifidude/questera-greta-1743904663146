import React from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';
import './index.css';

const ErrorFallback = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Application Error</h2>
      <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto mb-4">
        {error.message}
      </pre>
      <button
        onClick={() => window.location.reload()}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reload Application
      </button>
    </div>
  </div>
);

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found. Please check your HTML file.');
}

createRoot(root).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
  </ErrorBoundary>
);