import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2, Eye, EyeOff, LogIn } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, user } = useAuth();
  const [dataForm, setDataForm] = useState({ email: "", password: "" });
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

    if (!dataForm.email || !dataForm.password) {
      setLocalError("Silakan isi email dan password terlebih dahulu.");
      return;
    }

    const result = await login(dataForm.email, dataForm.password);
    if (result.success) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-1 text-center">
        Welcome Back 👋
      </h2>
      <p className="text-sm text-gray-400 text-center mb-6">
        Masuk ke akun Sedap Anda
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

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={dataForm.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all pr-10"
              placeholder="********"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Login
            </>
          )}
        </button>

        <div className="flex items-center justify-between mt-4 text-sm">
          <Link
            to="/register"
            className="text-gray-500 hover:text-green-600 transition-colors"
          >
            Buat akun baru
          </Link>
          <Link
            to="/forgot"
            className="text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Lupa password?
          </Link>
        </div>
      </form>
    </div>
  );
}