import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { DepartmentProvider } from './contexts/DepartmentContext';
import Layout from './components/Layout';
import DebugBox from './components/DebugBox';

// Lazy load components
const Welcome = React.lazy(() => import('./pages/Welcome'));
const CreateMethod = React.lazy(() => import('./pages/CreateMethod'));
const Home = React.lazy(() => import('./pages/Home'));
const Preview = React.lazy(() => import('./pages/Preview'));
const IndividualCreate = React.lazy(() => import('./pages/IndividualCreate'));

const ErrorFallback = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
          {error.message}
        </pre>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]" />
  </div>
);

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <DepartmentProvider>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/create" element={<CreateMethod />} />
                <Route path="/bulk" element={<Home />} />
                <Route path="/individual" element={<IndividualCreate />} />
                <Route path="/preview" element={<Preview />} />
                <Route
                  path="*"
                  element={
                    <div className="flex items-center justify-center min-h-[60vh]">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                          Page Not Found
                        </h2>
                        <p className="text-gray-600">
                          The page you're looking for doesn't exist.
                        </p>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </Suspense>
          </Layout>
          <DebugBox />
        </Router>
      </DepartmentProvider>
    </ErrorBoundary>
  );
}

export default App;