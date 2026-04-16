import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * ProtectedRoute — client-side route guard.
 *
 * While the session check is in flight → shows a loading indicator
 * (avoids a hydration mismatch since the server renders with loading=true too).
 *
 * Not authenticated → redirects to /login, preserving the intended URL
 * so the user is sent back after a successful login.
 *
 * Authenticated → renders children normally.
 *
 * NOTE: This is a UX layer only. Real security lives in the backend
 * requireAuth middleware that validates the JWT on every API call.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="animate-pulse text-sm text-slate-500 dark:text-slate-400">
          Verifying session…
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
