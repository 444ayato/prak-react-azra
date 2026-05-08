import { Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
//import Dashboard from './pages/Dashboard';
//import Orders from './pages/Orders';
//import Customers from './pages/Customers';
//import ErrorPage from './pages/ErrorPage';
//import MainLayout from './layouts/MainLayout';
//import Login from './pages/auth/Login';
//import Register from './pages/auth/Register';
//import Forgot from './pages/auth/Forgot';
//import AuthLayout from './layouts/AuthLayout';

const Dashboard = React.lazy(() => import("./pages/Dashboard"))
const Orders = React.lazy(() => import("./pages/Orders"))
const Customers = React.lazy(() => import("./pages/Customers"))
const ErrorPage = React.lazy(() => import("./pages/ErrorPage"))
const MainLayout = React.lazy(() => import("./layouts/MainLayout"))
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"))
const Login = React.lazy(() => import("./pages/auth/Login"))
const Register = React.lazy(() => import("./pages/auth/Register"))
const Forgot = React.lazy(() => import("./pages/auth/Forgot"))
const Loading = React.lazy(() => import("./components/Loading"))

function App() {
  return (
    <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />

          {/* Rute Latihan Error dari Dosen */}
          <Route path="/error-400" element={<ErrorPage code="400" description="Bad Request. Permintaan tidak valid." image="/img/error-400.png" />} />
          <Route path="/error-401" element={<ErrorPage code="401" description="Unauthorized. Anda tidak memiliki akses." image="/img/error-401.png" />} />
          <Route path="/error-403" element={<ErrorPage code="403" description="Forbidden. Akses halaman ini dilarang." image="/img/error-403.png" />} />
          
          {/* Wildcard Route untuk 404 - Harus di paling bawah */}
          <Route path="*" element={<ErrorPage code="404" description="Halaman tidak ditemukan." image="/img/error-404.png" />} />
          </Route>
          <Route element={<AuthLayout/>}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/forgot" element={<Forgot/>} />
        </Route>
        </Routes>
      </Suspense>
  );
}
export default App;