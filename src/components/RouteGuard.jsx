import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const RouteGuard = ({ children, requiresAuth = true, redirectTo = '/login' }) => {
  //Added isCheckingAuth
  const { isAuthenticated, isLoading, isCheckingAuth } = useAuthStore();
  const { pathname } = useLocation();
  
//Added isCheckingAuth
  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading...
      </div>
    );
  }

  // Protect private routes: redirect to redirectTo (e.g., /login) if not authenticated
  if (requiresAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  
  // Restrict guest routes: redirect to /dashboard if authenticated
  if (!requiresAuth && isAuthenticated && ['/login', '/register'].includes(pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RouteGuard;