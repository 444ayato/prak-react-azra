import { NavLink } from 'react-router-dom'; 
import { 
  MdSpaceDashboard, 
  MdOutlineShoppingCart, 
  MdOutlinePeopleAlt, 
  MdOutlineInventory2,
  MdOutlineCategory,
  MdErrorOutline,
  MdLogout
} from "react-icons/md";
import { useAuth } from '../contexts/AuthContext';
import { Crown } from 'lucide-react';

export default function Sidebar() {
  const { profile, user, isAdmin, isGuest, logout } = useAuth();

  const menuClass = ({ isActive }) =>
    `flex cursor-pointer items-center rounded-xl p-4 space-x-2 transition-all ${
      isActive ? 
        "text-green-600 bg-green-200 font-extrabold shadow-sm" : 
        "text-gray-600 hover:text-green-600 hover:bg-green-100"
    }`;

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen w-80 flex-col bg-white p-8 shadow-lg border-r border-gray-100">
      {/* Branding Section */}
      <div className="flex flex-col mb-8">
        <span className="text-[40px] font-bold text-gray-900 leading-tight">
          Sedap <b className="text-green-500">.</b>
        </span>
        <span className="font-semibold text-gray-400 text-sm">
          {isAdmin ? 'Admin Panel' : 'Member Area'}
        </span>
      </div>

      {/* User Profile Summary */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border border-green-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{displayName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] uppercase font-bold text-green-600 bg-green-200/50 px-1.5 py-0.5 rounded">
                {profile?.role || 'guest'}
              </span>
              {profile && (
                <>
                  <span className="text-[10px] font-medium text-amber-600 bg-amber-100/50 px-1.5 py-0.5 rounded">
                    {profile.tier}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {profile.points} pts
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {/* ===== MENU UNTUK SEMUA USER ===== */}
          <li>
            <NavLink id="menu-dashboard" to="/" end className={menuClass}>
              <MdSpaceDashboard className="mr-2 text-xl" /> 
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* ===== MENU UNTUK MEMBER ===== */}
          {!isAdmin && (
            <li>
              <NavLink id="menu-my-orders" to="/my-orders" className={menuClass}>
                <MdOutlineShoppingCart className="mr-2 text-xl" /> 
                <span>My Orders</span>
              </NavLink>
            </li>
          )}

          {/* ===== MENU UNTUK ADMIN ===== */}
          {isAdmin && (
            <>
              <div className="pt-4 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">
                Management
              </div>
              <li>
                <NavLink id="menu-orders" to="/orders" className={menuClass}>
                  <MdOutlineShoppingCart className="mr-2 text-xl" /> 
                  <span>Orders</span>
                </NavLink>
              </li>
              <li>
                <NavLink id="menu-customers" to="/customers" className={menuClass}>
                  <MdOutlinePeopleAlt className="mr-2 text-xl" /> 
                  <span>Customers</span>
                </NavLink>
              </li>
              <li>
                <NavLink id="menu-products" to="/products" className={menuClass}>
                  <MdOutlineInventory2 className="mr-2 text-xl" /> 
                  <span>Products</span>
                </NavLink>
              </li>

              <div className="pt-4 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">
                Playground
              </div>
              <li>
                <NavLink id="menu-components" to="/components" className={menuClass}>
                  <MdOutlineCategory className="mr-2 text-xl" /> 
                  <span>Components</span>
                </NavLink>
              </li>
              <li>
                <NavLink id="menu-xyz" to="/fitur-xyz" className={menuClass}>
                  <MdOutlineCategory className="mr-2 text-xl"/> 
                  <span>Fitur XYZ</span>
                </NavLink>
              </li>
              <li>
                <NavLink id="menu-note" to="/note" className={menuClass}>
                  <MdOutlineCategory className="mr-2 text-xl"/> 
                  <span>Note</span>
                </NavLink>
              </li>

              <div className="pt-4 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">
                Latihan Error
              </div>
              <li>
                <NavLink id="error-400" to="/error-400" className={menuClass}>
                  <MdErrorOutline className="mr-2 text-xl"/> 
                  <span>Error 400</span>
                </NavLink>
              </li>
              <li>
                <NavLink id="error-401" to="/error-401" className={menuClass}>
                  <MdErrorOutline className="mr-2 text-xl"/> 
                  <span>Error 401</span>
                </NavLink>
              </li>
              <li>
                <NavLink id="error-403" to="/error-403" className={menuClass}>
                  <MdErrorOutline className="mr-2 text-xl"/> 
                  <span>Error 403</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Bottom Section: User Info & Logout */}
      <div className="mt-auto pt-6 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <MdLogout className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}