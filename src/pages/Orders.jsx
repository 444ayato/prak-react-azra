import { FaPlus, FaFilter, FaDownload } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import orderData from "../data/orders.json";

export default function Orders() {
  return (
    <div className="p-4">
      <PageHeader title="Order List" breadcrumb="Orders">
        <button className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg font-bold shadow-md hover:bg-green-600">
          <FaPlus /> Add Orders
        </button>
      </PageHeader>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">Order Management</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-600"><FaFilter/> Filter</button>
            <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"><FaDownload/> Export</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs uppercase border-b">
                <th className="pb-4">Order ID</th>
                <th className="pb-4">Customer Name</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Total Price</th>
                <th className="pb-4">Order Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orderData.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-4 font-bold text-green-600">{order.id}</td>
                  <td className="py-4 text-gray-800">{order.name}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-600' : 
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                    }`}>{order.status}</span>
                  </td>
                  <td className="py-4 font-semibold">{order.total}</td>
                  <td className="py-4 text-gray-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}