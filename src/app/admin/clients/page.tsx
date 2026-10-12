"use client";

import { useState, useEffect } from "react";
import { Star, Building2, CheckCircle2, Plus, Trash2, Save } from "lucide-react";

interface Client {
  id: string;
  name: string;
  tag: string;
  tint_color: string;
  is_active: boolean;
}

const INITIAL_CLIENTS: Client[] = [
  { id: "1", name: "State Bank of India (SBI)", tag: "Public Sector", tint_color: "#283A97", is_active: true },
  { id: "2", name: "Bank of Baroda", tag: "National Bank", tint_color: "#EA580C", is_active: true },
  { id: "3", name: "ICICI Bank", tag: "Private Banking", tint_color: "#B91C1C", is_active: true },
  { id: "4", name: "Axis Bank", tag: "Commercial Banking", tint_color: "#9D174D", is_active: true },
  { id: "5", name: "HDFC Bank", tag: "Financial Services", tint_color: "#1E3A8A", is_active: true },
  { id: "6", name: "Indian Bank", tag: "Public Sector", tint_color: "#2563EB", is_active: true },
  { id: "7", name: "Muthoot Finance", tag: "NBFC Group", tint_color: "#DC2626", is_active: true },
  { id: "8", name: "Bank of Maharashtra", tag: "State Banking", tint_color: "#0284C7", is_active: true },
  { id: "9", name: "Cosmos Bank", tag: "Co-op Banking", tint_color: "#4F46E5", is_active: true },
  { id: "10", name: "City Union Bank", tag: "Commercial", tint_color: "#059669", is_active: true },
  { id: "11", name: "Punjab & Sindh Bank", tag: "Public Sector", tint_color: "#D97706", is_active: true },
];

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [newName, setNewName] = useState("");
  const [newTag, setNewTag] = useState("Banking / Corporate");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadClients() {
      try {
        const res = await fetch("/api/admin/content?section=clients");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setClients(json.data);
        }
      } catch (err) {
        console.error("Failed to load clients:", err);
      }
    }
    loadClients();
  }, []);

  async function persistClients(updatedList: Client[]) {
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "clients", data: updatedList }),
      });
    } catch (err) {
      console.error("Error saving clients:", err);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const newClient: Client = {
      id: Date.now().toString(),
      name: newName.trim(),
      tag: newTag,
      tint_color: "#283A97",
      is_active: true,
    };
    const updated = [...clients, newClient];
    setClients(updated);
    setNewName("");
    setShowAdd(false);
    await persistClients(updated);
  }

  async function toggleActive(id: string) {
    const updated = clients.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c));
    setClients(updated);
    await persistClients(updated);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    const updated = clients.filter((c) => c.id !== id);
    setClients(updated);
    try {
      await fetch(`/api/admin/content?section=clients&id=${id}`, { method: "DELETE" });
      await persistClients(updated);
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  }

  async function handleSaveAll() {
    setSaving(true);
    setSaved(false);
    try {
      await persistClients(clients);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert("Error saving clients: " + (err.message || String(err)));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Client Logos & Marquee</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage partner logos and banking institutions showcased in the website client marquee
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> {saved ? "Changes Saved ✓" : saving ? "Saving..." : "Save All"}
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#283A97] text-white text-sm font-semibold rounded-lg hover:bg-[#1e2d7a] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Partner
          </button>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1">
            <label className="block text-xs font-semibold text-neutral-700 uppercase">Institution / Client Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Canara Bank"
              required
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
            />
          </div>
          <div className="w-full sm:w-48 space-y-1">
            <label className="block text-xs font-semibold text-neutral-700 uppercase">Sector / Tag</label>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="e.g. Public Sector"
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#283A97]/20 focus:border-[#283A97]"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 border border-neutral-200 text-neutral-600 text-xs font-semibold rounded-lg hover:bg-neutral-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#283A97] text-white text-xs font-semibold rounded-lg hover:bg-[#1e2d7a] cursor-pointer"
            >
              Save Client
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-neutral-100">
          {clients.map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between hover:bg-neutral-50/60 transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: `${c.tint_color}15`, color: c.tint_color }}
                >
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-neutral-900">{c.name}</p>
                  <p className="text-xs text-neutral-400">{c.tag}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleActive(c.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                    c.is_active
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                  }`}
                >
                  {c.is_active ? "Marquee Active" : "Hidden"}
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 rounded cursor-pointer"
                  title="Remove client"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
