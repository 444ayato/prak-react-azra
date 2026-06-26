import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { Loader2 } from "lucide-react";

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(5);
      if (!error) setOrders(data || []);
      setLoading(false);
    };
    fetchRecent();
  }, []);

  if (loading) return <div className="bg-white p-6 rounded-xl shadow-md"><Loader2 className="w-6 h-6 animate-spin text-green-500 mx-auto" /></div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-400 uppercase text-xs">
              <th className="pb-3">Order ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {orders.length === 0 ? (
              <tr><td colSpan="4" className="py-8 text-center text-gray-400">Belum ada orders.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium text-green-600 text-xs">{o.id.slice(0, 8)}...</td>
                  <td className="py-4 font-semibold">{o.profiles?.full_name || "—"}</td>
                  <td className="py-4 font-bold">Rp {Number(o.total_amount).toLocaleString("id-ID")}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      o.status === "completed" ? "bg-green-100 text-green-600" :
                      o.status === "pending" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
                    }`}>{o.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}