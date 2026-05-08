import { NavLink } from 'react-router-dom'; 
import { MdSpaceDashboard, MdOutlineShoppingCart, MdOutlinePeopleAlt, MdErrorOutline } from "react-icons/md";

export default function Sidebar() {
  // Fungsi menuClass untuk mengatur state aktif dan hover pada menu
  const menuClass = ({ isActive }) =>
    `flex cursor-pointer items-center rounded-xl p-4 space-x-2 transition-all ${
      isActive ? 
        "text-green-600 bg-green-200 font-extrabold shadow-sm" : 
        "text-gray-600 hover:text-green-600 hover:bg-green-100"
    }`;

  return (
    <div className="flex min-h-screen w-80 flex-col bg-white p-8 shadow-lg border-r border-gray-100">
      {/* Branding Section */}
      <div className="flex flex-col mb-10">
        <span className="text-[40px] font-bold text-gray-900 leading-tight">
          Sedap <b className="text-green-500">.</b>
        </span>
        <span className="font-semibold text-gray-400">Modern Admin Dashboard</span>
      </div>

      {/* Navigation Section */}
      <div className="flex-1">
        <ul className="space-y-2">
          {/* Menu Utama */}
          <li>
            <NavLink id="menu-dashboard" to="/" className={menuClass}>
              <MdSpaceDashboard className="mr-2 text-xl" /> 
              <span>Dashboard</span>
            </NavLink>
          </li>
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
          
          {/* Section Latihan Error */}
          <div className="pt-6 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">
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
        </ul>
      </div>

      {/* Bottom Section: Profile Card */}
      <div className="mt-auto pt-10">
        <div className="bg-green-500 rounded-2xl p-4 text-white flex items-center shadow-lg relative overflow-hidden">
          {/* Dekorasi kecil untuk card profile */}
          <div className="absolute -right-2 -top-2 w-12 h-12 bg-white/10 rounded-full"></div>
          
          <div className="text-xs flex-1 z-10">
            <p className="font-medium opacity-90">Please organize your menus through button below!</p>
            <button className="mt-3 bg-white text-green-600 px-4 py-1.5 rounded-lg font-bold hover:bg-gray-50 transition shadow-sm">
              Add Menus
            </button>
          </div>
          <img 
            src="/img/hirono.jpg" 
            className="w-12 h-12 rounded-full border-2 border-white/50 ml-2 object-cover shadow-md z-10" 
            alt="user" 
            onError={(e) => e.target.src = "https://via.placeholder.com/50"}
          />
        </div>
      </div>
    </div>
  );
}