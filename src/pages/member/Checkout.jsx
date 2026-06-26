import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import { showSuccess, showError } from "../../lib/toast";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";

export default function Checkout() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");
      if (error) showError("Gagal memuat produk", error);
      else setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: {
        ...product,
        quantity: (prev[product.id]?.quantity || 0) + 1,
      },
    }));
  };

  const updateQty = (id, delta) => {
    setCart((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const newQty = current.quantity + delta;
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...current, quantity: newQty } };
    });
  };

  const cartItems = Object.values(cart);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setSubmitting(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({ profile_id: user.id, total_amount: totalAmount, status: "pending" })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        await supabase.from("orders").delete().eq("id", order.id);
        throw itemsError;
      }

      showSuccess("Pesanan berhasil dibuat!", "Status: pending");
      setCart({});
      navigate("/my-orders");
    } catch (err) {
      showError("Gagal checkout", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-10">
      <div className="bg-white border-b border-gray-100 px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-green-500" /> Checkout
        </h1>
        <p className="text-sm text-gray-400 mt-1">Pilih produk dan buat pesanan</p>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Products ({products.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{p.name}</p>
                    <p className="text-sm font-bold text-green-600">Rp {Number(p.price).toLocaleString("id-ID")}</p>
                    <p className="text-xs text-gray-400">Stok: {p.stock}</p>
                  </div>
                  <Button size="sm" onClick={() => addToCart(p)} disabled={p.stock <= 0}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart */}
        <div>
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Cart ({cartItems.length})
            </h2>

            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                Belum ada item di keranjang.
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Rp {Number(item.price).toLocaleString("id-ID")} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-xs" onClick={() => updateQty(item.id, -1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                      <Button variant="ghost" size="icon-xs" onClick={() => updateQty(item.id, 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cartItems.length > 0 && (
              <>
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total</span>
                    <span className="text-lg font-bold text-gray-800">Rp {totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                </div>
                <Button className="w-full gap-2" size="lg" onClick={handleCheckout} disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Buat Pesanan
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
