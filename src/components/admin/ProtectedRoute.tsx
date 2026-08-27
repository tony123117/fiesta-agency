import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { AdminLoading } from '@/components/admin/AdminUI';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) return <AdminLoading />;
  if (!session) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}
