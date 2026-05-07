import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaStar } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import RecentOrders from "../components/RecentOrders";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-10">
      <PageHeader />

      {/* Stats Section */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<FaShoppingCart />} count="75" label="Total Orders" color="bg-green-500" />
        <StatCard icon={<FaTruck />} count="175" label="Total Delivered" color="bg-blue-500" />
        <StatCard icon={<FaBan />} count="40" label="Total Canceled" color="bg-red-500" />
        <StatCard icon={<FaDollarSign />} count="Rp.128k" label="Total Revenue" color="bg-yellow-500" />
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NEW 1: Recent Orders Table */}
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>

        <div className="flex flex-col gap-6">
          {/* NEW 2: Latest Review with Hirono Profile */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-bold mb-4">Latest Review</h2>
            <div className="flex items-center space-x-4 mb-3">
              <img src="/img/hirono.jpg" className="w-12 h-12 rounded-full object-cover border" alt="User" />
              <div>
                <p className="font-bold">Anisa Rahma</p>
                <div className="flex text-yellow-400 text-xs"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
              </div>
            </div>
            <p className="text-gray-500 text-sm italic">"Makanannya enak banget, pengirimannya juga cepet banget! Bakal langganan terus."</p>
          </div>

          {/* NEW 3: Target Progress Bar */}
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
            <h2 className="text-lg font-bold mb-2">Weekly Target</h2>
            <p className="text-sm text-gray-400 mb-4">85% of goals reached.</p>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div className="bg-green-500 h-full w-[85%] transition-all duration-500"></div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
              <span>0%</span>
              <span className="text-green-600">85% ACHIEVED</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, count, label, color }) {
  return (
    <div className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4 border-b-2 border-transparent hover:border-green-500 transition-all">
      <div className={`${color} text-white rounded-full p-4 shadow-lg text-xl`}>{icon}</div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold">{count}</span>
        <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
}