import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2, Send, CheckCircle2 } from "lucide-react";

export default function Forgot() {
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email) {
      setLocalError("Silakan masukkan email Anda.");
      return;
    }

    const result = await forgotPassword(email);
    if (result.success) {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Cek Email Anda! 📧</h2>
        <p className="text-sm text-gray-500 mb-6">
          Kami telah mengirimkan link reset password ke <strong className="text-gray-700">{email}</strong>.
        </p>
        <Link
          to="/login"
          className="text-green-600 hover:text-green-700 font-medium transition-colors text-sm"
        >
          Kembali ke Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-1 text-center">
        Lupa Password? 🔐
      </h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Masukkan email Anda dan kami akan kirimkan link reset password.
      </p>

      {localError && (
        <Alert variant="destructive" className="mb-5">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{localError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (localError) setLocalError("");
            }}
            autoComplete="email"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
            placeholder="you@example.com"
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
              Mengirim...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Kirim Link Reset
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link
            to="/login"
            className="text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Kembali ke Login
          </Link>
        </p>
      </form>
    </div>
  );
}
