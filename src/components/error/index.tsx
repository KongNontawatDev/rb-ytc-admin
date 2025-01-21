import React, { Component, useEffect, useState } from 'react';
import { 
  useRouteError, 
  isRouteErrorResponse,
  useLocation,
} from 'react-router-dom';
import ClientError from './ClientError';
import NotFoundError from './NotFoundError';
import ForbiddenError from './ForbiddenError';
import ServerError from './ServerError';

// HOC for class error boundary
const withErrorBoundary = (WrappedComponent: React.ComponentType<any>) => {
  return class ErrorBoundary extends Component<{ children: React.ReactNode }, { error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { error: null };
    }

    static getDerivedStateFromError(error: Error) {
      return { error };
    }

    render() {
      if (this.state.error) {
        return <ClientError error={this.state.error} />;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};

// Main component that uses the error boundary
const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const ErrorBoundaryWithHOC = withErrorBoundary(MainContent);

// Wrapper component with route error handling
export const ErrorBoundaryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const routeError = useRouteError();
  const location = useLocation();
  const [key, setKey] = useState(0);
  
  // Reset error boundary on route change
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [location.pathname]);

  if (routeError) {
    if (isRouteErrorResponse(routeError)) {
      switch (routeError.status) {
        case 404:
          return <NotFoundError  />;
        case 403:
          return <ForbiddenError  />;
        case 500:
          return <ServerError  />;
        default:
          return <ClientError error={routeError} />;
      }
    }
    return <ClientError error={routeError instanceof Error ? routeError : undefined} />;
  }

  return (
    <ErrorBoundaryWithHOC key={key}>
      {children}
    </ErrorBoundaryWithHOC>
  );
};

export default ErrorBoundaryWrapper;