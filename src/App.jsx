import { Routes, Route } from 'react-router-dom';
import Sidebar from './layouts/Sidebar';
import Header from './layouts/Header';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />

          {/* Rute Latihan Error Dinamis */}
          <Route path="/error-400" element={<ErrorPage code="400" description="Permintaan tidak valid (Bad Request)." image="/img/error-400.png" />} />
          <Route path="/error-401" element={<ErrorPage code="401" description="Anda tidak terautorisasi (Unauthorized)." image="/img/error-401.png" />} />
          <Route path="/error-403" element={<ErrorPage code="403" description="Akses dilarang (Forbidden)." image="/img/error-403.png" />} />
          
          {/* Default 404 */}
          <Route path="*" element={<ErrorPage code="404" description="Halaman tidak ditemukan." image="/img/error-404.png" />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;