import { FaBell, FaSearch } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";

export default function Header() {
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
                
                {/* Chart Icon */}
                <div className="p-3 bg-blue-100 rounded-2xl cursor-pointer hover:bg-blue-200 transition-colors">
                    <FcAreaChart size={20} />
                </div>
                
                {/* Settings Icon */}
                <div className="p-3 bg-red-100 rounded-2xl text-red-500 cursor-pointer hover:bg-red-200 transition-colors">
                    <SlSettings size={20} />
                </div>

                {/* Profile Section */}
                <div className="flex items-center space-x-4 border-l pl-4 border-gray-300 ml-2">
                    <span className="text-sm text-gray-600">
                        Hello, <b className="text-gray-900">Fikri Muhaffizh</b>
                    </span>
                    <img
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                        src="/img/hirono.jpg"
                        alt="Profile Hirono"
                    />
                </div>
            </div>
        </div>
    );
}