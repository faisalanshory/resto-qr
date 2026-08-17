"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Store, Receipt, Save, Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminSettingsPage() {
  const { data: settings, error, mutate } = useSWR("/api/admin/settings", fetcher);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    taxRate: "",
    serviceChargeRate: "",
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || "",
        description: settings.description || "",
        taxRate: settings.taxRate?.toString() || "0",
        serviceChargeRate: settings.serviceChargeRate?.toString() || "0",
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error("Failed to save settings");
      
      mutate();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Error saving settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings && !error) return <div className="p-8 text-secondary">Loading settings...</div>;

  return (
    <div className="p-8 h-full flex flex-col bg-background overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-secondary mt-1">Configure your restaurant profile and billing preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8 pb-12">
        {/* Profile Section */}
        <div className="bg-surface border border-surface-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Store className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Restaurant Profile</h2>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Restaurant Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-background border border-surface-border px-4 py-2.5 rounded-xl text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-background border border-surface-border px-4 py-2.5 rounded-xl text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Billing & Taxes Section */}
        <div className="bg-surface border border-surface-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
              <Receipt className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Billing & Taxes</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Tax Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  className="w-full bg-background border border-surface-border px-4 py-2.5 rounded-xl text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary font-medium">%</span>
              </div>
              <p className="text-xs text-secondary mt-1.5">Automatically applied to all orders.</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">Service Fee (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  name="serviceChargeRate"
                  value={formData.serviceChargeRate}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  className="w-full bg-background border border-surface-border px-4 py-2.5 rounded-xl text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary font-medium">%</span>
              </div>
              <p className="text-xs text-secondary mt-1.5">Charge for dine-in service.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="font-bold">Settings saved successfully!</span>
        </div>
      )}
    </div>
  );
}
