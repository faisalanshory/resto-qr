"use client";

import useSWR from "swr";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ClientKDS() {
  const { data: orders, error, mutate } = useSWR("/api/admin/orders", fetcher, {
    refreshInterval: 5000,
  });

  if (!orders) {
    return <div className="h-full flex items-center justify-center text-secondary">Loading orders...</div>;
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      mutate(); // Refresh the list
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  const statuses = [
    { id: "NEW", label: "New Orders" },
    { id: "PREPARING", label: "Preparing" },
    { id: "READY", label: "Ready to Serve" }
  ];

  const ordersByStatus = orders.reduce((acc: any, order: any) => {
    if (!acc[order.status]) acc[order.status] = [];
    acc[order.status].push(order);
    return acc;
  }, {});

  const updateOrderStatus = handleUpdateStatus;

  return (
    <div className="p-6 h-screen flex flex-col bg-background">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Kitchen Display System</h1>
          <p className="text-secondary mt-1">Live order tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-secondary">Live Auto-sync</span>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 no-scrollbar">
        <div className="flex gap-6 h-full min-w-max">
          {statuses.map(status => (
            <div key={status.id} className="w-80 flex flex-col bg-surface border border-surface-border rounded-lg overflow-hidden flex-shrink-0">
              <div className="p-4 border-b border-surface-border bg-surface-variant flex justify-between items-center">
                <h2 className="font-bold text-sm tracking-wide text-foreground">{status.label}</h2>
                <span className="bg-background text-foreground text-xs font-bold px-2 py-1 rounded-md border border-surface-border">
                  {ordersByStatus[status.id]?.length || 0}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
                {(ordersByStatus[status.id] || []).map((order: any) => (
                  <div key={order.id} className="bg-surface border border-surface-border rounded-md p-4 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-base">{order.orderNumber}</h3>
                        <p className="text-xs text-secondary">Table {order.table?.tableNumber || "N/A"}</p>
                      </div>
                      <span className="text-xs flex items-center gap-1 text-secondary">
                        <Clock className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item: any) => {
                        let modifiers = { variants: {}, addons: [] };
                        try { if (item.modifiers) modifiers = JSON.parse(item.modifiers); } catch (e) {}
                        return (
                          <div key={item.id} className="text-sm">
                            <span className="font-bold">{item.quantity}x</span> {item.product.name}
                            {Object.entries(modifiers.variants || {}).map(([k, v]) => (
                              <div key={k} className="text-xs text-secondary ml-4">- {String(v)}</div>
                            ))}
                            {(modifiers.addons || []).map((addon: any) => (
                              <div key={addon.id} className="text-xs text-secondary ml-4">+ {addon.name}</div>
                            ))}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-2 mt-auto pt-2">
                      {(status.id === "NEW" || status.id === "PREPARING") && (
                        <button
                          onClick={() => {
                            if(confirm("Are you sure you want to cancel this order?")) {
                              updateOrderStatus(order.id, "CANCELLED")
                            }
                          }}
                          className="flex-none bg-red-50 text-red-600 border border-red-200 px-3 py-2 text-xs font-bold rounded-md hover:bg-red-100 transition-colors uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                      )}
                      {status.id === "NEW" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "PREPARING")}
                          className="flex-1 bg-primary text-primary-foreground py-2 text-xs font-bold uppercase tracking-wider rounded-md hover:opacity-90 transition-opacity"
                        >
                          Start Preparing
                        </button>
                      )}
                      {status.id === "PREPARING" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "READY")}
                          className="flex-1 bg-green-600 text-white py-2 text-xs font-bold uppercase tracking-wider rounded-md hover:bg-green-700 transition-colors"
                        >
                          Mark as Ready
                        </button>
                      )}
                      {status.id === "READY" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "COMPLETED")}
                          className="flex-1 bg-green-800 text-white py-2 text-xs font-bold uppercase tracking-wider rounded-md hover:bg-green-900 transition-colors"
                        >
                          Mark as Served
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
