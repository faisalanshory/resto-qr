"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCustomerSessionId } from "@/lib/session";

export default function ClientCart({
  restaurantId,
  tableId,
  restaurantSlug,
  tableNumber,
  taxRate = 10,
  serviceChargeRate = 5,
}: {
  restaurantId: string;
  tableId: string;
  restaurantSlug: string;
  tableNumber: string;
  taxRate?: number;
  serviceChargeRate?: number;
}) {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const subtotal = getCartTotal();
  const tax = subtotal * (taxRate / 100);
  const service = subtotal * (serviceChargeRate / 100);
  const total = subtotal + tax + service;

  const handleCheckout = async (paymentMethod: "PAY_LATER" | "SIMULATE_PAYMENT") => {
    setIsSubmitting(true);
    
    if (paymentMethod === "SIMULATE_PAYMENT") {
      // Redirect to simulated payment page
      router.push(`/r/${restaurantSlug}/table/${tableNumber}/payment`);
      return;
    }

    // Pay later - create order directly
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          tableId,
          items,
          subtotal,
          tax,
          serviceCharge: service,
          total,
          paymentStatus: "PENDING",
          paymentMethod: "PAY_LATER",
          customerSessionId: getCustomerSessionId(),
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");
      
      const { orderId } = await res.json();
      clearCart();
      router.push(`/r/${restaurantSlug}/table/${tableNumber}/bill`);
    } catch (error) {
      console.error(error);
      alert("Error placing order.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-center p-6 space-y-4 pt-20">
        <div className="w-24 h-24 bg-surface-variant rounded-full flex items-center justify-center text-secondary mb-4">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Your cart is empty</h2>
          <p className="text-secondary mt-2 text-sm">Add some delicious items from the menu.</p>
        </div>
        <Link href={`/r/${restaurantSlug}/table/${tableNumber}`}>
          <button className="mt-8 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium text-sm shadow-sm hover:opacity-90 transition-opacity">
            Browse Menu
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full absolute inset-0 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md flex items-center p-6 border-b border-surface-border">
        <Link href={`/r/${restaurantSlug}/table/${tableNumber}`}>
          <button className="p-2 -ml-2 rounded-md hover:bg-surface-variant text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-lg font-semibold ml-2 text-foreground tracking-tight">Order Summary</h1>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-48 relative z-0">
        {items.map((item) => (
          <div key={item.id} className="border-b border-surface-border pb-6 last:border-0 last:pb-0">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-base">{item.productName}</h3>
                
                {/* Modifiers List */}
                <div className="text-sm text-secondary mt-1 space-y-0.5">
                  {Object.entries(item.variants).map(([key, val]) => (
                    <div key={key}>{val}</div>
                  ))}
                  {item.addons.map((addon) => (
                    <div key={addon.id}>+ {addon.name}</div>
                  ))}
                  {item.notes && (
                    <div className="italic mt-1">Note: {item.notes}</div>
                  )}
                </div>
                
                <div className="text-primary font-semibold mt-2">
                  {formatRupiah(item.unitPrice)}
                </div>
              </div>
              
              <div className="flex flex-col items-end justify-between">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-secondary hover:text-error transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-3 bg-surface border border-surface-border rounded-md p-1 mt-4">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-1 rounded bg-surface disabled:opacity-50 text-foreground hover:bg-surface-variant transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-medium min-w-[16px] text-center text-sm text-foreground">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded bg-surface text-foreground hover:bg-surface-variant transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Bill Summary */}
        <div className="mt-8 bg-surface border border-surface-border rounded-lg p-5 space-y-3">
          <h3 className="font-semibold text-foreground mb-4 text-sm tracking-wide">PAYMENT SUMMARY</h3>
          <div className="flex justify-between text-sm text-secondary">
            <span>Subtotal</span>
            <span className="text-foreground">{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-secondary">Tax ({taxRate}%)</span>
            <span className="font-medium text-foreground">{formatRupiah(tax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-secondary">Service Charge ({serviceChargeRate}%)</span>
            <span className="font-medium text-foreground">{formatRupiah(service)}</span>
          </div>
          <div className="h-px w-full bg-surface-border my-4" />
          <div className="flex justify-between font-semibold text-lg">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">{formatRupiah(total)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background border-t border-surface-border p-4 space-y-3 z-20">
        <button
          onClick={() => handleCheckout("SIMULATE_PAYMENT")}
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-medium text-sm shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? "PROCESSING..." : "PAY NOW"}
        </button>
        <button
          onClick={() => handleCheckout("PAY_LATER")}
          disabled={isSubmitting}
          className="w-full bg-surface text-foreground py-3.5 rounded-lg font-medium text-sm hover:bg-surface-variant transition-colors disabled:opacity-50 border border-surface-border shadow-sm"
        >
          PAY LATER
        </button>
      </div>
    </div>
  );
}
