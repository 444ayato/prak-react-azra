import { useState, useEffect, useCallback } from "react";
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
import { Loader2, User, Coins, Award } from "lucide-react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ points: "", tier: "" });

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) showError("Gagal memuat customers", error);
    else setCustomers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const openEdit = (c) => {
    setEditing(c);
    setEditForm({ points: String(c.points), tier: c.tier });
    setEditDialog(true);
  };

  const handleSaveProfile = async () => {
    if (!editing) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ points: parseInt(editForm.points) || 0, tier: editForm.tier })
      .eq("id", editing.id);
    if (error) { showError("Gagal update", error); setSaving(false); return; }
    showSuccess("Customer berhasil diupdate!");
    setSaving(false);
    setEditDialog(false);
    fetchCustomers();
  };

  const getInitial = (name) => (name || "?").charAt(0).toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-10">
      <PageHeader title="Customers" breadcrumb="Customers" />

      <div className="px-5">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-green-500" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {customers.map((person) => (
              <div key={person.id} className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center border-b-4 border-transparent hover:border-green-500 transition-all">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold mb-4 ring-4 ring-green-50">
                  {getInitial(person.full_name)}
                </div>
                <h3 className="font-bold text-lg text-gray-800">{person.full_name || "No Name"}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded mb-2 ${
                  person.role === "admin" ? "bg-purple-50 text-purple-600" :
                  person.role === "member" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"
                }`}>
                  {person.role}
                </span>

                {/* Points & Tier */}
                <div className="flex gap-3 mb-4">
                  <div className="flex items-center gap-1 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    <Coins className="w-3 h-3" /> {person.points} pts
                  </div>
                  <div className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
                    person.tier === "Gold" ? "bg-yellow-50 text-yellow-600" :
                    person.tier === "Silver" ? "bg-gray-100 text-gray-600" : "bg-orange-50 text-orange-600"
                  }`}>
                    <Award className="w-3 h-3" /> {person.tier}
                  </div>
                </div>

                {/* Info */}
                <div className="w-full text-gray-500 text-sm space-y-1 mb-4">
                  <p className="flex items-center justify-center gap-2 truncate">
                    <User className="w-3 h-3 text-gray-400" /> ID: {person.id.slice(0, 8)}...
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => openEdit(person)}
                >
                  Edit Points / Tier
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Points/Tier Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>{editing?.full_name || "Customer"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Points</Label><Input type="number" value={editForm.points} onChange={(e) => setEditForm({ ...editForm, points: e.target.value })} /></div>
            <div>
              <Label>Tier</Label>
              <select 
                value={editForm.tier}
                onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}