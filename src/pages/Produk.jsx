import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { showSuccess, showError } from "../lib/toast";
import PageHeader from "../components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit3, Trash2, Loader2 } from "lucide-react";

export default function Produk() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "" });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) showError("Gagal memuat produk", error);
    else setProducts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const resetForm = () => setForm({ name: "", description: "", price: "", stock: "" });
  const openAdd = () => { setEditing(null); resetForm(); setDialogOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || "", price: String(p.price), stock: String(p.stock) });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { showError("Validasi", "Nama dan harga wajib diisi."); return; }
    setSaving(true);
    const payload = { name: form.name, description: form.description, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 };
    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) { showError("Gagal update", error); setSaving(false); return; }
      showSuccess("Produk berhasil diupdate!");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { showError("Gagal tambah produk", error); setSaving(false); return; }
      showSuccess("Produk berhasil ditambahkan!");
    }
    setSaving(false);
    setDialogOpen(false);
    fetchProducts();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("products").delete().eq("id", deleteId);
    if (error) { showError("Gagal hapus", error); }
    else { showSuccess("Produk berhasil dihapus!"); fetchProducts(); }
    setDeleteId(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-10">
      <PageHeader title="Product List" breadcrumb="Products">
        <Button onClick={openAdd} className="gap-2"><Plus className="w-4 h-4" /> Add Product</Button>
      </PageHeader>

      <div className="px-5">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Product Management ({products.length})</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-green-500" /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Belum ada produk. Klik "Add Product" untuk menambahkan.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wider border-b">
                    <th className="pb-4 font-bold">Name</th>
                    <th className="pb-4 font-bold">Price</th>
                    <th className="pb-4 font-bold">Stock</th>
                    <th className="pb-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y divide-gray-50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-green-50 transition">
                      <td className="py-4">
                        <Link to={`/products/${p.id}`} className="font-semibold text-emerald-600 hover:text-emerald-700">{p.name}</Link>
                        {p.description && <p className="text-xs text-gray-400 mt-0.5">{p.description}</p>}
                      </td>
                      <td className="py-4 font-bold">Rp {Number(p.price).toLocaleString("id-ID")}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${p.stock > 30 ? "bg-green-100 text-green-600" : p.stock > 10 ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(p)}><Edit3 className="w-4 h-4" /></Button>
                          <Button variant="destructive" size="icon-sm" onClick={() => setDeleteId(p.id)}><Trash2 className="w-4 h-4" /></Button>
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogDescription>{editing ? "Ubah informasi produk." : "Masukkan informasi produk baru."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Nama Produk</Label><Input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama produk" /></div>
            <div><Label>Deskripsi</Label><Input name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi (opsional)" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Harga (Rp)</Label><Input name="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="10000" /></div>
              <div><Label>Stok</Label><Input name="stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" /></div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              {editing ? "Update" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Hapus Produk</DialogTitle><DialogDescription>Yakin ingin menghapus produk ini? Tindakan ini tidak bisa dibatalkan.</DialogDescription></DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}