"use client";

import useSWR from "swr";
import { formatRupiah, cn } from "@/lib/utils";
import { CheckCircle2, Clock, Check, Utensils, Flag } from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ClientOrder({
  initialOrder,
  restaurantSlug,
  tableNumber,
}: {
  initialOrder: any;
  restaurantSlug: string;
  tableNumber: string;
}) {
  const { data: order } = useSWR(`/api/orders/${initialOrder.id}`, fetcher, {
    fallbackData: initialOrder,
    refreshInterval: 3000, // Poll every 3 seconds
  });

  const statuses = [
    { id: "NEW", label: "Order Received", icon: Clock },
    { id: "CONFIRMED", label: "Confirmed", icon: Check },
    { id: "PREPARING", label: "Preparing", icon: Utensils },
    { id: "READY", label: "Ready", icon: CheckCircle2 },
    { id: "COMPLETED", label: "Completed", icon: Flag },
  ];

  const currentStatusIndex = statuses.findIndex((s) => s.id === order.status);

  return (
    <div className="flex flex-col h-full max-w-md mx-auto relative shadow-2xl bg-background overflow-y-auto">
      <div className="bg-primary text-primary-on p-6 flex flex-col items-center justify-center space-y-4 pt-12">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
          <p className="text-primary-container text-sm mt-1">Table {tableNumber}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-surface border border-surface-variant/50 rounded-m3-xl p-6 shadow-sm space-y-6">
          <h2 className="font-bold text-lg">Order Status</h2>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-variant before:to-transparent">
            {statuses.map((status, index) => {
              const Icon = status.icon;
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              
              return (
                <div key={status.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 bg-surface shrink-0 z-10",
                    isCompleted ? "border-primary text-primary" : "border-outline text-outline/50",
                    isCurrent ? "bg-primary text-primary-on border-primary shadow-m3-2" : ""
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0">
                    <p className={cn("font-bold", isCompleted ? "text-primary" : "text-outline/70")}>{status.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 bg-surface border border-surface-variant/50 rounded-m3-xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-lg">Order Details</h2>
          <div className="space-y-3">
            {order.items.map((item: any) => {
              let modifiers = { variants: {}, addons: [] };
              try {
                if (item.modifiers) modifiers = JSON.parse(item.modifiers);
              } catch (e) {}

              return (
                <div key={item.id} className="flex justify-between items-start text-sm">
                  <div className="flex gap-3">
                    <span className="font-bold text-primary">{item.quantity}x</span>
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <div className="text-secondary text-xs mt-0.5 space-y-0.5">
                        {Object.entries(modifiers.variants || {}).map(([k, v]) => (
                          <div key={k}>{String(v)}</div>
                        ))}
                        {(modifiers.addons || []).map((addon: any) => (
                          <div key={addon.id}>+ {addon.name}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="font-medium">{formatRupiah(item.unitPrice * item.quantity)}</span>
                </div>
              );
            })}
          </div>
          <div className="h-px bg-surface-variant my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">{formatRupiah(order.total)}</span>
          </div>
          <div className="flex justify-between text-sm text-secondary">
            <span>Payment Status</span>
            <span className={cn(
              "font-bold uppercase",
              order.paymentStatus === "PAID" ? "text-[#0F5223]" : "text-[#BA1A1A]"
            )}>{order.paymentStatus}</span>
          </div>
        </div>
        
        <Link href={`/r/${restaurantSlug}/table/${tableNumber}`}>
          <button className="w-full mt-6 bg-surface-variant text-surface-onVariant py-4 rounded-m3-xl font-bold transition-all">
            Back to Menu
          </button>
        </Link>
      </div>
    </div>
  );
}
