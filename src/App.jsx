import { Routes, Route } from 'react-router-dom';
import React, { Suspense, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

const Dashboard = React.lazy(() => import("./pages/Dashboard"))
const MemberDashboard = React.lazy(() => import("./pages/member/Dashboard"))
const Orders = React.lazy(() => import("./pages/Orders"))
const Customers = React.lazy(() => import("./pages/Customers"))
const Produk = React.lazy(() => import("./pages/Produk"))
const Components = React.lazy(() => import("./pages/Components"))
const ErrorPage = React.lazy(() => import("./pages/ErrorPage"))
const MainLayout = React.lazy(() => import("./layouts/MainLayout"))
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"))
const Login = React.lazy(() => import("./pages/auth/Login"))
const Register = React.lazy(() => import("./pages/auth/Register"))
const Forgot = React.lazy(() => import("./pages/auth/Forgot"))
const Loading = React.lazy(() => import("./components/Loading"))
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"))
const FiturXyz = React.lazy(() => import("./pages/FiturXyz"))
const Note = React.lazy(() => import("./pages/Note"))
const Checkout = React.lazy(() => import("./pages/member/Checkout"))
const MyOrders = React.lazy(() => import("./pages/member/MyOrders"))

// ─── Dynamic Home Route: Admin → Dashboard, Member → MemberDashboard ───
function HomeRoute() {
  const { isAdmin, loading, refreshProfile, user } = useAuth();

  // Refresh profile setiap kali halaman dimuat (sinkron dengan database)
  useEffect(() => {
    if (user) refreshProfile();
  }, []);

  if (loading) return <Loading />;
  return isAdmin ? <Dashboard /> : <MemberDashboard />;
}

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* ── RUTE AUTH (tanpa sidebar) ── */}
          <Route element={<AuthLayout/>}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/forgot" element={<Forgot/>} />
          </Route>

          {/* ── RUTE TERPROTEKSI (dengan sidebar & header) ── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              {/* Dynamic home based on role */}
              <Route path="/" element={<HomeRoute />} />
              
              {/* Member routes */}
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/checkout" element={<Checkout />} />

              {/* Khusus Admin */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/orders" element={<Orders />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/products" element={<Produk />} />
                <Route path="/products/:id" element={<ProductDetail />} /> 
                <Route path="/components" element={<Components />} />
                <Route path="/fitur-xyz" element={<FiturXyz />} />
                <Route path="/note" element={<Note />} />
                <Route path="/error-400" element={<ErrorPage code="400" description="Bad Request. Permintaan tidak valid." />} />
                <Route path="/error-401" element={<ErrorPage code="401" description="Unauthorized. Anda tidak memiliki akses." />} />
                <Route path="/error-403" element={<ErrorPage code="403" description="Forbidden. Akses halaman ini dilarang." />} />
              </Route>

              {/* Wildcard 404 */}
              <Route path="*" element={<ErrorPage code="404" description="Halaman tidak ditemukan." />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
export default App;