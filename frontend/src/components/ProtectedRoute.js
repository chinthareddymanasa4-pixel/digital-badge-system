import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '@phosphor-icons/react';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" data-testid="loading-screen">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-8 h-8 text-[#5B21B6] animate-spin" />
          <p className="text-[#52525B] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
