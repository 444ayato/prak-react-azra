export default function RecentOrders() {
  const orders = [
    { id: "#00123", customer: "Aris Munandar", menu: "Nasi Goreng Spesial", status: "Delivered", price: "Rp 35.000" },
    { id: "#00124", customer: "Siti Aminah", menu: "Ayam Bakar Madu", status: "Pending", price: "Rp 45.000" },
    { id: "#00125", customer: "Budi Santoso", menu: "Es Teh Manis", status: "Canceled", price: "Rp 5.000" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-400 uppercase text-xs">
              <th className="pb-3">Order ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Menu</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {orders.map((o, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-4 font-medium text-blue-600">{o.id}</td>
                <td className="py-4 font-semibold">{o.customer}</td>
                <td className="py-4">{o.menu}</td>
                <td className="py-4 font-bold">{o.price}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    o.status === 'Delivered' ? 'bg-green-100 text-green-600' : 
                    o.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                  }`}>{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}