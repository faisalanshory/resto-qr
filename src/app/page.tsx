"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, Lock, ChevronRight, UtensilsCrossed, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    // Simulate network delay for demo
    setTimeout(() => {
      router.push("/admin/tables");
    }, 800);
  };

  const handleCustomerScan = (tableNumber: string) => {
    // Simulate scanning a QR code for a specific table
    router.push(`/r/akc-library-cafe/table/${tableNumber}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 z-10">
        
        {/* Customer Demo Section */}
        <div className="bg-surface/50 backdrop-blur-xl border border-surface-border p-8 rounded-3xl shadow-2xl flex flex-col">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
            <QrCode className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Customer Demo</h2>
          <p className="text-secondary text-sm mb-8">
            Simulate scanning a QR code at the table. Experience the seamless digital menu, ordering, and payment flow.
          </p>
          
          <div className="space-y-3 mt-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">Select a Table to &quot;Scan&quot;</h3>
            <button 
              onClick={() => handleCustomerScan("1")}
              className="w-full flex items-center justify-between p-4 bg-background border border-surface-border rounded-xl hover:bg-surface-variant hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold">1</div>
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">Table 1</span>
              </div>
              <ChevronRight className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
            </button>
            <button 
              onClick={() => handleCustomerScan("2")}
              className="w-full flex items-center justify-between p-4 bg-background border border-surface-border rounded-xl hover:bg-surface-variant hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold">2</div>
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">Table 2</span>
              </div>
              <ChevronRight className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>

        {/* Admin Demo Section */}
        <div className="bg-surface/80 backdrop-blur-xl border border-surface-border p-8 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-200 shadow-sm">Demo Mode</span>
          </div>
          
          <div className="w-14 h-14 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Admin Portal</h2>
          <p className="text-secondary text-sm mb-8">
            Manage live orders, control table sessions, and update menus in real-time.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4 mt-auto">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Email Address</label>
              <input 
                type="email" 
                defaultValue="admin@akc-library-cafe.com" 
                readOnly
                className="w-full bg-background border border-surface-border px-4 py-3 rounded-xl text-sm font-medium text-foreground outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all opacity-70"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Password</label>
              <input 
                type="password" 
                defaultValue="demo12345" 
                readOnly
                className="w-full bg-background border border-surface-border px-4 py-3 rounded-xl text-sm font-medium text-foreground outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all opacity-70"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-4 bg-foreground text-background py-3.5 rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoggingIn ? "Authenticating..." : (
                <>
                  Login as Admin
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>

      <div className="mt-16 text-center z-10 flex items-center gap-2 text-secondary opacity-60">
        <UtensilsCrossed className="w-4 h-4" />
        <span className="text-xs font-semibold tracking-wider uppercase">Powered by QR Resto</span>
      </div>
    </div>
  );
}
