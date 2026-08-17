"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { formatRupiah } from "@/lib/utils";
import { ArrowLeft, Clock, CheckCircle2, ReceiptText, ChefHat, BellRing, Wallet } from "lucide-react";
import Link from "next/link";
import { getCustomerSessionId } from "@/lib/session";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ClientBill({
  restaurantSlug,
  tableNumber,
}: {
  restaurantSlug: string;
  tableNumber: string;
}) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setSessionId(getCustomerSessionId());
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const { data: orders, error } = useSWR(
    sessionId ? `/api/orders/session?sessionId=${sessionId}&tableId=${tableNumber}` : null,
    fetcher,
    { refreshInterval: 5000 }
  );

  const handleCallWaiter = async (type: "HELP" | "BILL") => {
    setIsCalling(true);
    try {
      await fetch(`/api/tables/${tableNumber}/waiter`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ needsWaiter: true }),
      });
      setToastMessage(type === "HELP" ? "A waiter will be with you shortly." : "The cashier has been notified. Please wait.");
    } catch (e) {
      console.error(e);
      setToastMessage("Failed to call waiter. Please try again.");
    } finally {
      setIsCalling(false);
      setShowCallModal(false);
    }
  };

  if (!orders && !error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-secondary">
        Loading your session...
      </div>
    );
  }

  if (error || (orders && orders.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-center p-6 space-y-4 pt-20">
        <ReceiptText className="w-12 h-12 text-surface-border mb-2" />
        <h2 className="text-xl font-semibold tracking-tight text-foreground">No active orders</h2>
        <p className="text-secondary text-sm">You haven&apos;t ordered anything yet.</p>
        <Link href={`/r/${restaurantSlug}/table/${tableNumber}`}>
          <button className="mt-8 bg-primary text-primary-foreground px-6 py-2.5 text-sm rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity">
            Browse Menu
          </button>
        </Link>
      </div>
    );
  }

  const unpaidOrders = orders.filter((o: any) => o.paymentStatus !== "PAID" && o.status !== "CANCELLED");
  const totalUnpaid = unpaidOrders.reduce((acc: number, o: any) => acc + o.total, 0);

  return (
    <div className="flex flex-col h-full absolute inset-0 bg-background overflow-y-auto pb-32 relative z-0">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md flex items-center p-6 border-b border-surface-border">
        <Link href={`/r/${restaurantSlug}/table/${tableNumber}`}>
          <button className="p-2 -ml-2 text-foreground hover:bg-surface-variant rounded-md transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-lg font-semibold ml-2 text-foreground tracking-tight">Your Session</h1>
      </div>

      <div className="p-6 space-y-8">
        <div className="space-y-1">
          <p className="text-sm text-secondary font-medium uppercase tracking-wider">Table {tableNumber}</p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Order History</h2>
        </div>

        <div className="bg-surface-variant p-4 rounded-xl flex justify-between items-center border border-surface-border">
          <div>
            <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">Session Total</p>
            <p className="text-lg font-bold text-foreground">{formatRupiah(orders.filter((o: any) => o.status !== 'CANCELLED').reduce((acc: number, o: any) => acc + o.total, 0))}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-1">Unpaid</p>
            <p className="text-lg font-bold text-amber-600">{formatRupiah(totalUnpaid)}</p>
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className={`border-t border-surface-border pt-6 ${order.status === 'CANCELLED' ? 'opacity-50 grayscale' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-foreground text-lg">Order {order.orderNumber}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-xs text-secondary font-medium">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                  order.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-200' :
                  order.status === 'READY' ? 'bg-[#97E7BC] text-[#064E3B] border-[#34D399]' :
                  order.status === 'PREPARING' ? 'bg-[#99AFD2] text-[#1E3A8A] border-[#60A5FA]' :
                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-800 border-red-200' :
                  'bg-surface-variant text-secondary border-surface-border'
                }`}>
                  {order.status === 'COMPLETED' ? 'SERVED' : order.status}
                </span>
              </div>

              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground"><span className="text-secondary mr-2">{item.quantity}x</span> {item.product.name}</span>
                    <div className={`font-semibold text-sm ${order.status === 'CANCELLED' ? 'line-through text-secondary' : 'text-foreground'}`}>
                      {formatRupiah(item.unitPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Indicator */}
              <div className="mt-4 p-3 bg-surface-variant rounded-lg flex items-center gap-3">
                {order.status === "NEW" && <Clock className="w-4 h-4 text-secondary" />}
                {order.status === "PREPARING" && <ChefHat className="w-4 h-4 text-accent" />}
                {(order.status === "READY" || order.status === "COMPLETED") && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                <span className="text-sm font-medium text-foreground">
                  {order.status === "NEW" ? "Received by kitchen" : 
                   order.status === "PREPARING" ? "Being prepared" : 
                   order.status === "CANCELLED" ? "Order cancelled" : 
                   order.status === "COMPLETED" ? "Served to your table" : "Ready to serve"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface border-t border-surface-border p-4 z-20 flex gap-3 shadow-lg">
        <button
          onClick={() => handleCallWaiter("HELP")}
          className="flex-1 flex flex-col items-center justify-center p-3 bg-surface-variant text-foreground rounded-lg hover:bg-surface-border transition-colors font-medium text-xs gap-1.5"
        >
          <BellRing className="w-5 h-5" />
          Call Waiter
        </button>
        <button
          onClick={() => setShowCallModal(true)}
          disabled={totalUnpaid === 0}
          className="flex-[2] flex flex-col items-center justify-center p-3 bg-primary text-primary-foreground rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed font-medium text-xs gap-1.5"
        >
          <Wallet className="w-5 h-5" />
          {totalUnpaid === 0 ? "Bill Paid" : `Close Bill (${formatRupiah(totalUnpaid)})`}
        </button>
      </div>

      {/* Close Bill Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setShowCallModal(false)} />
          <div className="bg-surface rounded-xl p-6 w-full max-w-sm shadow-xl relative z-10 space-y-6 animate-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-lg font-bold text-foreground">Close Bill</h3>
              <p className="text-sm text-secondary mt-1">How would you like to settle your bill?</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/r/${restaurantSlug}/table/${tableNumber}/payment`)}
                className="w-full p-4 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity text-left flex justify-between items-center"
              >
                <span>Pay Now (QRIS)</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
              <button
                onClick={() => handleCallWaiter("BILL")}
                className="w-full p-4 bg-surface-variant text-foreground text-sm font-medium rounded-lg hover:bg-surface-border transition-colors text-left"
              >
                Ask cashier to come to table
              </button>
              <button
                onClick={() => { setShowCallModal(false); router.push(`/r/${restaurantSlug}/table/${tableNumber}`); }}
                className="w-full p-4 bg-surface border border-surface-border text-foreground text-sm font-medium rounded-lg hover:bg-surface-variant transition-colors text-left"
              >
                I will pay at the cashier counter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Themed Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300 w-max max-w-[90vw]">
          <div className="bg-foreground text-background px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 text-sm font-medium tracking-wide border border-surface-border">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
