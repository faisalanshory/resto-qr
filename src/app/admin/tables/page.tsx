"use client";

import useSWR from "swr";
import { Users, AlertCircle, RefreshCw, QrCode, Link as LinkIcon } from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminTablesPage() {
  const { data: tables, error, mutate } = useSWR("/api/admin/tables", fetcher, {
    refreshInterval: 5000,
  });

  const [updating, setUpdating] = useState<string | null>(null);

  const handleClearTable = async (tableId: string, tableNumber: string) => {
    if (!confirm(`Are you sure you want to CLOSE Table ${tableNumber}?\nThis will clear the customer's session.`)) {
      return;
    }

    setUpdating(tableId);
    try {
      const res = await fetch(`/api/admin/tables/${tableId}/clear`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to clear");
      await mutate();
    } catch (e) {
      console.error(e);
      alert("Failed to clear table. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const handleStatusChange = async (tableId: string, newStatus: string) => {
    setUpdating(tableId);
    try {
      await fetch(`/api/admin/tables/${tableId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      mutate();
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleResolveWaiter = async (tableNumber: string) => {
    try {
      await fetch(`/api/tables/${tableNumber}/waiter`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ needsWaiter: false }), // Assuming admin waiter toggle uses the same schema or different
      });
      mutate();
    } catch (e) {
      console.error(e);
      alert("Failed to resolve waiter alert");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      mutate();
    } catch (e) {
      console.error(e);
      alert("Failed to cancel order");
    }
  };

  if (!tables) return <div className="p-4 sm:p-8 text-secondary">Loading tables...</div>;

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col bg-background">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Table Management</h1>
          <p className="text-secondary mt-1">Monitor active tables and manage customer sessions.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm text-secondary px-4 py-2 bg-surface border border-surface-border rounded-xl">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            {tables.filter((t: any) => t.status === "AVAILABLE").length} Available
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary px-4 py-2 bg-surface border border-surface-border rounded-xl">
            <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
            {tables.filter((t: any) => t.status === "OCCUPIED").length} Occupied
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary px-4 py-2 bg-surface border border-surface-border rounded-xl">
            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
            {tables.filter((t: any) => t.status === "RESERVED").length} Reserved
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-8">
        {tables.map((table: any) => {
          const isOccupied = table.activeSessionId != null;
          
          return (
            <div key={table.id} className="bg-surface border border-surface-border rounded-2xl p-6 flex flex-col shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">Table {table.tableNumber}</h2>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`flex h-2 w-2 rounded-full ${
                      table.status === 'OCCUPIED' ? 'bg-amber-500' : 
                      table.status === 'RESERVED' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></span>
                    <select
                      value={table.status}
                      onChange={(e) => handleStatusChange(table.id, e.target.value)}
                      disabled={updating === table.id}
                      className="text-xs font-bold uppercase tracking-wider text-secondary bg-transparent outline-none cursor-pointer hover:text-foreground"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="OCCUPIED">Occupied</option>
                      <option value="RESERVED">Reserved</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  {table.needsWaiter && (
                    <button
                      onClick={() => handleResolveWaiter(table.tableNumber)}
                      title="Waiter Called! Click to resolve."
                      className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors border border-red-200 animate-pulse"
                    >
                      <AlertCircle className="w-5 h-5" />
                    </button>
                  )}
                  <Link href={`/r/akc-library-cafe/table/${table.tableNumber}`} target="_blank">
                    <button title="View QR / Customer Page" className="p-2 bg-surface-variant text-secondary hover:text-foreground rounded-lg transition-colors border border-surface-border">
                      <QrCode className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              </div>

              {isOccupied ? (
                <div className="space-y-4 flex-1 flex flex-col">
                  {table.needsWaiter && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-red-800 text-sm font-medium flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Customer needs assistance
                      </div>
                      <button onClick={() => handleResolveWaiter(table.tableNumber)} className="text-xs uppercase font-bold tracking-wider hover:underline">
                        Resolve
                      </button>
                    </div>
                  )}
                  
                  {/* Active Orders List */}
                  <div className="bg-surface-variant rounded-lg border border-surface-border p-3 space-y-3 max-h-48 overflow-y-auto no-scrollbar">
                    {table.orders?.filter((o: any) => o.customerSessionId === table.activeSessionId).length === 0 ? (
                      <p className="text-secondary text-xs text-center py-2">No orders placed yet.</p>
                    ) : (
                      table.orders?.filter((o: any) => o.customerSessionId === table.activeSessionId).map((order: any) => (
                        <div key={order.id} className={`space-y-1.5 border-b border-surface-border/50 pb-2 last:border-0 last:pb-0 ${order.status === 'CANCELLED' ? 'opacity-50' : ''}`}>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-secondary uppercase">#{order.orderNumber}</span>
                            <div className="flex items-center gap-2">
                              {(order.status === "NEW" || order.status === "PREPARING") && (
                                <button 
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider"
                                >
                                  Cancel
                                </button>
                              )}
                              <span 
                                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border"
                                style={
                                  order.status === 'READY' ? { backgroundColor: '#97E7BC', color: '#064E3B', borderColor: '#34D399' } :
                                  order.status === 'PREPARING' ? { backgroundColor: '#99AFD2', color: '#1E3A8A', borderColor: '#60A5FA' } :
                                  order.status === 'COMPLETED' ? { backgroundColor: '#D1FAE5', color: '#065F46', borderColor: '#A7F3D0' } :
                                  order.status === 'CANCELLED' ? { backgroundColor: '#FEE2E2', color: '#991B1B', borderColor: '#FECACA' } :
                                  { backgroundColor: '#F3F4F6', color: '#4B5563', borderColor: '#E5E7EB' }
                                }
                              >
                                {order.status}
                              </span>
                              <span className={cn(
                                "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                                order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                              )}>
                                {order.paymentStatus}
                              </span>
                            </div>
                          </div>
                          {order.items?.map((item: any) => {
                            const taxRate = table.restaurant?.taxRate || 10;
                            const serviceRate = table.restaurant?.serviceChargeRate || 5;
                            const loadedPrice = item.unitPrice * (1 + (taxRate / 100) + (serviceRate / 100));
                            
                            return (
                              <div key={item.id} className="flex justify-between text-xs text-foreground items-start">
                                <span className={`flex-1 pr-2 ${order.status === 'CANCELLED' ? 'line-through text-secondary' : ''}`}>
                                  <span className="font-semibold text-primary mr-1.5">{item.quantity}x</span> 
                                  {item.product?.name || "Unknown Item"}
                                </span>
                                <span className="text-secondary font-medium whitespace-nowrap">
                                  {formatRupiah(loadedPrice)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="bg-background p-3 rounded-lg text-sm border border-surface-border flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <p className="text-secondary text-xs font-semibold uppercase">Session Total</p>
                      <p className="font-bold text-foreground text-sm">
                        {formatRupiah(table.orders?.filter((o: any) => o.customerSessionId === table.activeSessionId && o.status !== 'CANCELLED').reduce((sum: number, o: any) => sum + o.total, 0) || 0)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-surface-border/50">
                      <p className="text-secondary text-xs font-semibold uppercase">Unpaid</p>
                      <p className="font-bold text-amber-600 text-sm">
                        {formatRupiah(table.orders?.filter((o: any) => o.customerSessionId === table.activeSessionId && o.status !== 'CANCELLED' && o.paymentStatus !== 'PAID').reduce((sum: number, o: any) => sum + o.total, 0) || 0)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => handleClearTable(table.id, table.tableNumber)}
                      disabled={updating === table.id}
                      className="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors border border-red-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className={`w-4 h-4 ${updating === table.id ? 'animate-spin' : ''}`} />
                      {updating === table.id ? 'Closing...' : 'Close Table Session'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                  <p className="text-secondary text-sm">
                    {table.status === 'RESERVED' ? 'Table is reserved for upcoming guests.' : 'Table is ready for new customers.'}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
