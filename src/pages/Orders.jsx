import { FaPlus, FaFilter, FaDownload } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import orderData from "../data/orders.json"; // Mengambil 30 data JSON kamu

export default function Orders() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-10">
      <PageHeader title="Order List" breadcrumb="Orders">
        <button className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-600 transition shadow-lg">
          <FaPlus /> Add Orders
        </button>
      </PageHeader>

      <div className="px-5">
        <div className="bg-white rounded-2xl shadow-md p-6 overflow-hidden border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Order Management</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition"><FaFilter /> Filter</button>
              <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition"><FaDownload /> Export</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b">
                  <th className="pb-4 font-bold">Order ID</th>
                  <th className="pb-4 font-bold">Customer Name</th>
                  <th className="pb-4 font-bold">Status</th>
                  <th className="pb-4 font-bold">Total Price</th>
                  <th className="pb-4 font-bold">Order Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y divide-gray-50">
                {orderData.map((order) => (
                  <tr key={order.id} className="hover:bg-green-50 transition">
                    <td className="py-4 font-bold text-green-600">{order.id}</td>
                    <td className="py-4 font-semibold text-gray-800">{order.name}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-600' : 
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-gray-900">{order.total}</td>
                    <td className="py-4 text-gray-400 text-sm">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}