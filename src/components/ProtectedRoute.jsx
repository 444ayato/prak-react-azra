import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';

/**
 * ProtectedRoute - Routing guard component.
 *
 * Props:
 *   - requiredRole (optional): 'admin' | 'member'
 *     Jika tidak diset, hanya cek authentication (login).
 *   - redirectTo (optional): path redirect jika tidak punya akses. Default '/login'.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>           → hanya cek login
 *   <Route element={<ProtectedRoute requiredRole="admin" />}> → cek login + role admin
 */
export default function ProtectedRoute({ requiredRole, redirectTo = '/login' }) {
  const { user, profile, loading, isGuest } = useAuth();

  // ─── Loading state ───
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-green-600 text-lg font-medium">Memeriksa akses...</p>
        </div>
      </div>
    );
  }

  // ─── Guest / Belum login ───
  if (isGuest || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // ─── Role check ───
  if (requiredRole && profile?.role !== requiredRole) {
    // Admin coba akses halaman member → tetap izinkan (admin punya akses penuh)
    if (profile?.role === 'admin') {
      return <Outlet />;
    }
    // Member coba akses halaman admin → redirect ke dashboard member
    return <Navigate to="/" replace />;
  }

  // ─── Authorized ───
  return <Outlet />;
}
