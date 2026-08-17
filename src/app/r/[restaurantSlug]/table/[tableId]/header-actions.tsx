"use client";

import { useState, useEffect } from "react";
import { BellRing, Loader2, CheckCircle2 } from "lucide-react";

export default function HeaderActions({ tableNumber }: { tableNumber: string }) {
  const [isCalling, setIsCalling] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleCallWaiter = async () => {
    if (isCalling) return;
    setIsCalling(true);
    try {
      await fetch(`/api/tables/${tableNumber}/waiter`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ needsWaiter: true }),
      });
      setShowToast(true);
    } catch (e) {
      console.error(e);
      alert("Failed to call waiter");
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <>
      <button
        onClick={handleCallWaiter}
        disabled={isCalling}
      className="flex items-center gap-2 px-3 py-1.5 bg-surface-variant hover:bg-surface-border text-foreground rounded-full text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
    >
      {isCalling ? (
        <Loader2 className="w-4 h-4 animate-spin text-secondary" />
      ) : (
        <BellRing className="w-4 h-4 text-secondary" />
        )}
        <span>Waiter</span>
      </button>

      {/* Themed Toast Notification */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-foreground text-background px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 text-sm font-medium tracking-wide border border-surface-border">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            A waiter will be with you shortly.
          </div>
        </div>
      )}
    </>
  );
}
