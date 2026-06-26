import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2, UserPlus, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, user } = useAuth();
  const [dataForm, setDataForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
    if (localError) setLocalError("");
  };

  // Redirect jika sudah login
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validasi
    if (!dataForm.email || !dataForm.password || !dataForm.confirmPassword) {
      setLocalError("Silakan isi semua field yang wajib.");
      return;
    }

    if (dataForm.password.length < 6) {
      setLocalError("Password minimal 6 karakter.");
      return;
    }

    if (dataForm.password !== dataForm.confirmPassword) {
      setLocalError("Konfirmasi password tidak cocok.");
      return;
    }

    const result = await register(dataForm.email, dataForm.password, dataForm.fullName);
    if (result.success) {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-1 text-center">
        Create Your Account ✨
      </h2>
      <p className="text-sm text-gray-400 text-center mb-6">
        Daftar akun baru Sedap
      </p>

      {localError && (
        <Alert variant="destructive" className="mb-5">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{localError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nama Lengkap
          </label>
          <input
            name="fullName"
            type="text"
            value={dataForm.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
            placeholder="Nama Anda"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={dataForm.email}
            onChange={handleChange}
            autoComplete="email"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={dataForm.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all pr-10"
              placeholder="Min. 6 karakter"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Konfirmasi Password
          </label>
          <input
            name="confirmPassword"
            type="password"
            value={dataForm.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Mendaftarkan...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Register
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Login di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
