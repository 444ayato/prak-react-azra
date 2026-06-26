import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Package, 
  ShoppingBag, 
  Loader2, 
  Search,
  Filter,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  XCircle,
  AlertCircle
} from "lucide-react";
import { showSuccess, showError } from "../../lib/toast";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-600 border-yellow-200",
  completed: "bg-green-100 text-green-600 border-green-200",
  cancelled: "bg-red-100 text-red-600 border-red-200",
};

const statusLabels = {
  pending: "Menunggu",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export default function MyOrders() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cancelling, setCancelling] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    let query = supabase
      .from("orders")
      .select("*, order_items(*, products(name, image_url, price))")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      setFetchError("Gagal memuat pesanan. Silakan coba lagi.");
      console.error("Fetch orders error:", error);
    } else {
      setOrders(data || []);
      setFetchError(null);
    }
    setLoading(false);
  }, [user, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ─── Filter berdasarkan pencarian ───
  const filteredOrders = orders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      (o.order_items || []).some((item) =>
        item.products?.name?.toLowerCase().includes(q)
      )
    );
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || "Member";

  // ─── Cancel Order ───
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Yakin ingin membatalkan pesanan ini?")) return;
    setCancelling(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId)
      .eq("profile_id", user.id);

    if (error) {
      showError("Gagal membatalkan pesanan", error);
    } else {
      showSuccess("Pesanan berhasil dibatalkan");
      fetchOrders();
    }
    setCancelling(null);
  };

  // ─── Statistik pesanan ───
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const totalSpent = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="w-7 h-7 text-green-500" />
          My Orders
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Kelola dan lihat riwayat pesanan Anda, {displayName.split(' ')[0]}
        </p>
      </div>

      <div className="p-5 space-y-6">
        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Pesanan</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{completedOrders}</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Selesai</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  Rp {totalSpent.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Belanja</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Search & Filter ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari order ID atau produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-400" />
              {[
                { key: "all", label: "Semua" },
                { key: "pending", label: "Menunggu" },
                { key: "completed", label: "Selesai" },
                { key: "cancelled", label: "Dibatalkan" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStatusFilter(s.key)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                    statusFilter === s.key
                      ? "bg-green-500 text-white shadow-md shadow-green-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Orders List ── */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-green-500 mb-3" />
              <p className="text-sm text-gray-400">Memuat pesanan...</p>
            </div>
          ) : fetchError ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-600 mb-1">Gagal Memuat Data</h3>
              <p className="text-sm text-gray-400 max-w-xs mb-4">{fetchError}</p>
              <button
                onClick={fetchOrders}
                className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-600 mb-1">
                {searchQuery || statusFilter !== "all"
                  ? "Tidak ada pesanan ditemukan"
                  : "Belum Ada Pesanan"}
              </h3>
              <p className="text-sm text-gray-400 max-w-xs">
                {searchQuery || statusFilter !== "all"
                  ? "Coba ubah filter atau kata kunci pencarian Anda."
                  : "Anda belum memiliki pesanan. Mulai belanja sekarang!"}
              </p>
            </div>
          ) : (
            filteredOrders.map((o) => {
              const items = o.order_items || [];
              const itemCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

              return (
                <div
                  key={o.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Order Header (always visible) */}
                  <div
                    className="p-5 cursor-pointer select-none"
                    onClick={() => toggleExpand(o.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Status indicator */}
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          o.status === "completed" ? "bg-green-500" :
                          o.status === "pending" ? "bg-yellow-500" :
                          "bg-red-500"
                        }`} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-bold text-green-600">
                              {o.id.slice(0, 12)}...
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusStyles[o.status] || "bg-gray-100 text-gray-500"}`}>
                              {statusLabels[o.status] || o.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(o.created_at).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span>{itemCount} item{itemCount > 1 ? "s" : ""}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-800">
                            Rp {Number(o.total_amount).toLocaleString("id-ID")}
                          </p>
                        </div>
                        {expandedId === o.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === o.id && (
                    <div className="border-t border-gray-100 bg-gray-50/50">
                      <div className="p-5 space-y-4">
                        {/* Order Items */}
                        {items.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                              Item Pesanan
                            </h4>
                            <div className="space-y-2">
                              {items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    {item.products?.image_url ? (
                                      <img
                                        src={item.products.image_url}
                                        alt={item.products.name}
                                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <Package className="w-5 h-5 text-green-500" />
                                      </div>
                                    )}
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-gray-800 truncate">
                                        {item.products?.name || "Produk"}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        {item.quantity} x Rp {Number(item.price || item.products?.price || 0).toLocaleString("id-ID")}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-sm font-bold text-gray-800 ml-3">
                                    Rp {Number((item.price || item.products?.price || 0) * (item.quantity || 1)).toLocaleString("id-ID")}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Order Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {o.shipping_address && (
                            <div className="flex items-start gap-2 text-sm text-gray-500 bg-white rounded-xl p-3 border border-gray-100">
                              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-0.5">Alamat</p>
                                <p>{o.shipping_address}</p>
                              </div>
                            </div>
                          )}
                          {o.payment_method && (
                            <div className="flex items-start gap-2 text-sm text-gray-500 bg-white rounded-xl p-3 border border-gray-100">
                              <CreditCard className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-0.5">Pembayaran</p>
                                <p>{o.payment_method}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center bg-white rounded-xl p-3 border border-gray-100">
                          <span className="text-sm text-gray-500">Total Pesanan</span>
                          <span className="text-lg font-bold text-gray-800">
                            Rp {Number(o.total_amount).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
