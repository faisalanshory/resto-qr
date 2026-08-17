"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store";
import { formatRupiah } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { QrCode, CheckCircle2, ArrowLeft, Loader2, Smartphone, CreditCard, Banknote } from "lucide-react";
import { getCustomerSessionId } from "@/lib/session";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ClientPayment({
  restaurantSlug,
  tableNumber,
  restaurantId,
  tableId,
  taxRate = 10,
  serviceChargeRate = 5,
}: {
  restaurantSlug: string;
  tableNumber: string;
  restaurantId: string;
  tableId: string;
  taxRate?: number;
  serviceChargeRate?: number;
}) {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "PROCESSING" | "SUCCESS">("IDLE");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    setMounted(true);
    setSessionId(getCustomerSessionId());
  }, []);

  const { data: sessionOrders, error: sessionError } = useSWR(
    mounted && items.length === 0 && sessionId
      ? `/api/orders/session?sessionId=${sessionId}&tableId=${tableNumber}`
      : null,
    fetcher
  );

  if (!mounted) return null;

  const isPayingCart = items.length > 0;
  
  let totalToPay = 0;
  let subtotal = 0;
  let tax = 0;
  let service = 0;

  if (isPayingCart) {
    subtotal = getCartTotal();
    tax = subtotal * (taxRate / 100);
    service = subtotal * (serviceChargeRate / 100);
    totalToPay = subtotal + tax + service;
  } else if (sessionOrders) {
    const unpaidOrders = sessionOrders.filter((o: any) => o.paymentStatus !== "PAID" && o.status !== "CANCELLED");
    totalToPay = unpaidOrders.reduce((acc: number, o: any) => acc + o.total, 0);
  }

  const handleSimulatePayment = async () => {
    setStatus("PROCESSING");
    
    setTimeout(async () => {
      try {
        if (isPayingCart) {
          // Create new order as PAID
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
              total: totalToPay,
              paymentStatus: "PAID",
              paymentMethod: "QRIS",
              customerSessionId: sessionId,
            }),
          });
          if (!res.ok) throw new Error("Failed to create order");
          clearCart();
        } else if (sessionOrders) {
          // Update existing orders to PAID
          const unpaidOrders = sessionOrders.filter((o: any) => o.paymentStatus !== "PAID" && o.status !== "CANCELLED");
          await Promise.all(unpaidOrders.map((order: any) => 
            fetch(`/api/admin/orders/${order.id}/status`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentStatus: "PAID" }),
            })
          ));
        }
        
        setStatus("SUCCESS");
      } catch (error) {
        console.error(error);
        alert("Payment simulation failed.");
        setStatus("IDLE");
      }
    }, 2000);
  };

  if (!isPayingCart && !sessionOrders && !sessionError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-secondary">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading bill details...</p>
      </div>
    );
  }

  if (status === "SUCCESS") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background p-6 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">Payment Successful!</h2>
        <p className="text-secondary text-sm mb-8">Thank you for your order. We&apos;re preparing your food.</p>
        <button 
          onClick={() => router.push(`/r/${restaurantSlug}/table/${tableNumber}/bill`)}
          className="w-full max-w-sm bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity"
        >
          View E-Receipt
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col p-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/r/${restaurantSlug}/table/${tableNumber}${isPayingCart ? '/cart' : '/bill'}`}>
          <button className="p-2 -ml-2 rounded-md hover:bg-surface-variant text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-xl font-bold text-foreground">Complete Payment</h1>
      </div>

      <div className="bg-background rounded-3xl p-6 shadow-sm border border-surface-border mb-6">
        <p className="text-secondary text-sm text-center mb-1">Total to Pay</p>
        <h2 className="text-4xl font-bold text-foreground text-center mb-8">{formatRupiah(totalToPay)}</h2>

        <div className="aspect-square w-full max-w-[240px] mx-auto bg-surface-variant rounded-2xl flex items-center justify-center border-2 border-dashed border-surface-border mb-8 p-8 relative overflow-hidden">
          <QrCode className="w-full h-full text-secondary opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
            <Smartphone className="w-8 h-8 text-foreground" />
            <p className="text-sm font-semibold text-foreground text-center">Scan with any<br/>E-Wallet App</p>
          </div>
        </div>

        {isPayingCart && (
          <div className="space-y-3 mb-6 bg-surface-variant rounded-xl p-4">
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Subtotal</span>
              <span className="font-medium text-foreground">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Tax ({taxRate}%)</span>
              <span className="font-medium text-foreground">{formatRupiah(tax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Service Charge ({serviceChargeRate}%)</span>
              <span className="font-medium text-foreground">{formatRupiah(service)}</span>
            </div>
          </div>
        )}

        <button 
          onClick={handleSimulatePayment}
          disabled={status === "PROCESSING"}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
        >
          {status === "PROCESSING" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              Simulate Successful Payment
            </>
          )}
        </button>
      </div>

      <div className="mt-auto text-center">
        <p className="text-xs text-secondary font-medium uppercase tracking-wider mb-3">Accepted Payment Methods</p>
        <div className="flex justify-center gap-4 text-secondary opacity-50">
          <CreditCard className="w-6 h-6" />
          <Banknote className="w-6 h-6" />
          <Smartphone className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
