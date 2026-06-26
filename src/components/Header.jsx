import { FaBell, FaSearch } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, Loader2 } from "lucide-react";

export default function Header() {
  const { profile, user, loading, logout } = useAuth();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userRole = profile?.role || 'guest';
  const userPoints = profile?.points ?? '—';
  const userTier = profile?.tier || '—';

  return (
    <div className="flex justify-between items-center p-4">
      {/* Search Bar Section */}
      <div className="relative w-full max-w-lg">
        <input
          className="border border-gray-100 p-2 pr-10 bg-white w-full max-w-lg rounded-md outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          type="text"
          placeholder="Search Here..."
        />
        <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
      </div>

      {/* Icon & Profile Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative p-3 bg-blue-100 rounded-2xl text-blue-500 cursor-pointer hover:bg-blue-200 transition-colors">
          <FaBell />
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-blue-200 rounded-full px-2 py-1 text-xs font-bold text-blue-700">
            50
          </span>
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-4 border-l pl-4 border-gray-300 ml-2">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          ) : (
            <>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Hello, <b className="text-gray-900">{displayName}</b>
                </p>
                <div className="flex items-center gap-1.5 justify-end mt-0.5">
                  <span className="text-[10px] uppercase font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                    {userRole}
                  </span>
                  {profile && (
                    <>
                      <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        {userTier}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {userPoints} pts
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="relative group">
                <img
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                  src="/img/hirono.jpg"
                  alt={displayName}
                />
                <button
                  onClick={logout}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded-lg shadow-lg whitespace-nowrap"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3 inline mr-1" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}