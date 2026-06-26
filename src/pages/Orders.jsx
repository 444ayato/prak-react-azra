import { useState, useEffect, useCallback } from "react";
import { supabase } from "../services/supabaseClient";
import { showSuccess, showError } from "../lib/toast";
import PageHeader from "../components/PageHeader";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Filter } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("orders")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error) showError("Gagal memuat orders", error);
    else setOrders(data || []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) { showError("Gagal update status", error); }
    else {
      showSuccess(`Order status: ${newStatus}`);
      fetchOrders();
    }
    setUpdating(null);
  };

  const statusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-600",
      completed: "bg-green-100 text-green-600",
      cancelled: "bg-red-100 text-red-600",
    };
    return `px-3 py-1 rounded-full text-[10px] font-bold ${styles[status] || "bg-gray-100 text-gray-500"}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-10">
      <PageHeader title="Order Management" breadcrumb="Orders" />

      <div className="px-5">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-4 h-4 text-gray-400" />
            {["all", "pending", "completed", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                  statusFilter === s
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-green-500" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Belum ada orders.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wider border-b">
                    <th className="pb-4 font-bold">Order ID</th>
                    <th className="pb-4 font-bold">Customer</th>
                    <th className="pb-4 font-bold">Total</th>
                    <th className="pb-4 font-bold">Status</th>
                    <th className="pb-4 font-bold">Date</th>
                    <th className="pb-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y divide-gray-50">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-green-50 transition">
                      <td className="py-4 font-bold text-green-600 text-xs">{o.id.slice(0, 8)}...</td>
                      <td className="py-4 font-semibold text-gray-800">{o.profiles?.full_name || "—"}</td>
                      <td className="py-4 font-bold">Rp {Number(o.total_amount).toLocaleString("id-ID")}</td>
                      <td className="py-4"><span className={statusBadge(o.status)}>{o.status}</span></td>
                      <td className="py-4 text-sm text-gray-400">{new Date(o.created_at).toLocaleDateString("id-ID")}</td>
                      <td className="py-4">
                        <div className="flex gap-1">
                          {o.status === "pending" && (
                            <>
                              <Button variant="ghost" size="icon-sm" className="text-green-600" onClick={() => updateStatus(o.id, "completed")} disabled={updating === o.id}>
                                {updating === o.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                              </Button>
                              <Button variant="ghost" size="icon-sm" className="text-red-600" onClick={() => updateStatus(o.id, "cancelled")} disabled={updating === o.id}>
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {o.status !== "pending" && <span className="text-xs text-gray-300 italic">Done</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}