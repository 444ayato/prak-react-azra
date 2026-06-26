import { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import { 
  User, 
  Award, 
  Coins, 
  ShoppingBag, 
  Package, 
  Crown,
  Loader2
} from "lucide-react";

function MemberOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(name))")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false });
      if (!error) setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  const badge = (status) => {
    const s = {
      pending: "bg-yellow-100 text-yellow-600",
      completed: "bg-green-100 text-green-600",
      cancelled: "bg-red-100 text-red-600",
    };
    return `px-3 py-1 rounded-full text-[10px] font-bold ${s[status] || "bg-gray-100"}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-blue-500" />
        Riwayat Pesanan ({orders.length})
      </h3>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-green-500" /></div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ShoppingBag className="w-12 h-12 text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">Belum ada pesanan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-gray-400">Order {o.id.slice(0, 8)}...</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">
                    Rp {Number(o.total_amount).toLocaleString("id-ID")}
                  </p>
                </div>
                <span className={badge(o.status)}>{o.status}</span>
              </div>
              {o.order_items?.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  {o.order_items.map((item) => (
                    <p key={item.id} className="text-xs text-gray-500">
                      {item.products?.name || "Product"} x{item.quantity}
                    </p>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-gray-400 mt-2">
                {new Date(o.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminUpgradeCard() {
  const { user, refreshProfile } = useAuth();
  const [upgrading, setUpgrading] = useState(false);
  const [done, setDone] = useState(false);

  const upgradeToAdmin = async () => {
    if (!user || done) return;
    setUpgrading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id);

    if (error) {
      alert('Gagal: ' + error.message);
    } else {
      setDone(true);
      await refreshProfile();
      window.location.reload();
    }
    setUpgrading(false);
  };

  return (
    <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-purple-800">🔧 Akses Admin</h3>
          <p className="text-sm text-purple-600 mt-1">
            Klik tombol di samping untuk mengubah akun ini menjadi Admin.
          </p>
        </div>
        <button
          onClick={upgradeToAdmin}
          disabled={upgrading || done}
          className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg ${
            done
              ? 'bg-green-500'
              : 'bg-purple-600 hover:bg-purple-700 active:scale-95'
          } disabled:opacity-50`}
        >
          {upgrading ? (
            <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Upgrading...</span>
          ) : done ? (
            '✅ Done! Refresh...'
          ) : (
            'Upgrade ke Admin'
          )}
        </button>
      </div>
    </div>
  );
}

export default function MemberDashboard() {
  const { profile, user, loading } = useAuth();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("profile_id", user.id).then(({ count }) => {
      if (count !== null) setOrderCount(count);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-500 mb-3" />
        <p className="text-gray-500">Memuat dashboard...</p>
      </div>
    );
  }

  const displayName = profile?.full_name || user?.email || "Member";
  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    : '-';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {displayName.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">Ini adalah dashboard member Anda</p>
      </div>

      <div className="p-5">
        {/* Profile & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{displayName}</h3>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-50 text-green-600 border border-green-200 mt-2">
                  <User className="w-3 h-3" />
                  {profile?.role || 'member'}
                </span>
                <div className="w-full border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Email</span>
                    <span className="text-gray-700 font-medium">{user?.email}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Member sejak</span>
                    <span className="text-gray-700 font-medium">{memberSince}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Points Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{profile?.points ?? 0}</p>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Points</p>
                </div>
              </div>
            </div>

            {/* Tier Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  profile?.tier === 'Gold' ? 'bg-yellow-100' :
                  profile?.tier === 'Silver' ? 'bg-gray-200' :
                  'bg-orange-100'
                }`}>
                  <Crown className={`w-6 h-6 ${
                    profile?.tier === 'Gold' ? 'text-yellow-600' :
                    profile?.tier === 'Silver' ? 'text-gray-500' :
                    'text-orange-600'
                  }`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{profile?.tier || 'Bronze'}</p>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Tier</p>
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
              <p className="text-2xl font-bold text-gray-800">{orderCount}</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty Progress */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Loyalty Progress
          </h3>
          
          <div className="space-y-4">
            {/* Tier Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-600">Menuju Silver</span>
                <span className="text-gray-400">{Math.min((profile?.points || 0) / 100 * 100, 100)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((profile?.points || 0) / 100 * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {profile?.points || 0} / 100 poin menuju Silver
              </p>
            </div>

            {/* Tier Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className={`p-3 rounded-xl border text-center ${
                profile?.tier === 'Bronze' ? 'border-orange-300 bg-orange-50' : 'border-gray-100'
              }`}>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">Bronze</p>
                <p className="text-[10px] text-gray-400">0 - 99 poin</p>
              </div>
              <div className={`p-3 rounded-xl border text-center ${
                profile?.tier === 'Silver' ? 'border-gray-300 bg-gray-50' : 'border-gray-100'
              }`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Silver</p>
                <p className="text-[10px] text-gray-400">100 - 499 poin</p>
              </div>
              <div className={`p-3 rounded-xl border text-center ${
                profile?.tier === 'Gold' ? 'border-yellow-300 bg-yellow-50' : 'border-gray-100'
              }`}>
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-600 mb-1">Gold</p>
                <p className="text-[10px] text-gray-400">500+ poin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order History from Supabase */}
        <MemberOrders />

        {/* Admin Upgrade Card */}
        <AdminUpgradeCard />
      </div>
    </div>
  );
}
