import { NavLink } from 'react-router-dom'; 
import { MdSpaceDashboard, MdOutlineShoppingCart, MdOutlinePeopleAlt, MdErrorOutline } from "react-icons/md";

export default function Sidebar() {
  const menuClass = ({ isActive }) =>
    `flex cursor-pointer items-center rounded-xl p-4 space-x-2 ${
      isActive ? 
        "text-green-600 bg-green-200 font-extrabold" : 
        "text-gray-600 hover:text-green-600 hover:bg-green-100 transition-all"
    }`;

  return (
    <div className="flex min-h-screen w-80 flex-col bg-white p-8 shadow-lg">
      <div className="flex flex-col mb-10">
        <span className="text-[40px] font-bold text-gray-900 leading-tight">
          Sedap <b className="text-green-500">.</b>
        </span>
        <span className="font-semibold text-gray-400">Modern Admin Dashboard</span>
      </div>

      <div className="flex-1">
        <ul className="space-y-2">
          <li><NavLink to="/" className={menuClass}><MdSpaceDashboard size={20}/> <span>Dashboard</span></NavLink></li>
          <li><NavLink to="/orders" className={menuClass}><MdOutlineShoppingCart size={20}/> <span>Orders</span></NavLink></li>
          <li><NavLink to="/customers" className={menuClass}><MdOutlinePeopleAlt size={20}/> <span>Customers</span></NavLink></li>
          
          <div className="pt-4 pb-2 text-xs font-bold text-gray-400 uppercase">Latihan Error</div>
          <li><NavLink to="/error-400" className={menuClass}><MdErrorOutline/> <span>Error 400</span></NavLink></li>
          <li><NavLink to="/error-401" className={menuClass}><MdErrorOutline/> <span>Error 401</span></NavLink></li>
          <li><NavLink to="/error-403" className={menuClass}><MdErrorOutline/> <span>Error 403</span></NavLink></li>
        </ul>
      </div>

      <div className="mt-auto pt-10">
        <div className="bg-green-500 rounded-2xl p-4 text-white flex items-center shadow-lg">
          <div className="text-xs flex-1">
            <p>Please organize your menus through button below!</p>
            <button className="mt-2 bg-white text-green-600 px-4 py-1 rounded-lg font-bold">Add Menus</button>
          </div>
          <img src="/img/hirono.jpg" className="w-12 h-12 rounded-full border-2 border-white/50 ml-2" alt="user" />
        </div>
      </div>
    </div>
  );
}