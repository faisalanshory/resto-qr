"use client";

import { useState } from "react";
import useSWR from "swr";
import { formatRupiah, cn } from "@/lib/utils";
import { Search, ChevronDown, ChevronUp, Receipt, LayoutList, Rows3 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ClientOrders() {
  const { data: orders, error } = useSWR("/api/admin/orders/history", fetcher, {
    refreshInterval: 10000,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"GROUPED" | "FLAT">("GROUPED");
  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({});

  if (!orders) {
    return <div className="h-full flex items-center justify-center text-secondary">Loading history...</div>;
  }

  // Filter orders first
  const filteredOrders = orders.filter((order: any) => {
    return order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (order.table?.tableNumber || "").includes(searchTerm);
  });

  // Group by customerSessionId
  const sessionsMap = filteredOrders.reduce((acc: any, order: any) => {
    const sid = order.customerSessionId;
    if (!acc[sid]) {
      acc[sid] = {
        sessionId: sid,
        tableNumber: order.table?.tableNumber || "N/A",
        createdAt: order.createdAt,
        total: 0,
        orders: [],
        paymentStatus: order.paymentStatus // Just take the first one, or could calculate
      };
    }
    acc[sid].orders.push(order);
    if (order.status !== 'CANCELLED') {
      acc[sid].total += order.total;
    }
    // Update session date if this order is newer
    if (new Date(order.createdAt) > new Date(acc[sid].createdAt)) {
      acc[sid].createdAt = order.createdAt;
    }
    return acc;
  }, {});

  const sessions = Object.values(sessionsMap).sort((a: any, b: any) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const toggleSession = (sid: string) => {
    setExpandedSessions(prev => ({ ...prev, [sid]: !prev[sid] }));
  };

  return (
    <div className="p-8 space-y-8 bg-background min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Order History</h1>
          <p className="text-secondary mt-1 text-sm">View all past and active orders.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search table or order..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-64 bg-surface border border-surface-border rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground shadow-sm"
            />
          </div>

          <div className="flex bg-surface border border-surface-border rounded-xl p-1 shadow-sm w-full sm:w-auto">
            <button
              onClick={() => setViewMode("GROUPED")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                viewMode === "GROUPED" ? "bg-background shadow-sm text-foreground" : "text-secondary hover:text-foreground"
              )}
            >
              <Rows3 className="w-4 h-4" />
              Sessions
            </button>
            <button
              onClick={() => setViewMode("FLAT")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                viewMode === "FLAT" ? "bg-background shadow-sm text-foreground" : "text-secondary hover:text-foreground"
              )}
            >
              <LayoutList className="w-4 h-4" />
              List
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-secondary bg-surface border border-surface-border rounded-2xl shadow-sm">
            <Receipt className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No orders found matching your search.</p>
          </div>
        ) : viewMode === "GROUPED" ? (
          sessions.map((session: any) => {
            const isExpanded = expandedSessions[session.sessionId];
            
            // Determine if the whole session is paid (all orders paid)
            const activeOrders = session.orders.filter((o: any) => o.status !== 'CANCELLED');
            const allPaid = activeOrders.length > 0 ? activeOrders.every((o: any) => o.paymentStatus === 'PAID') : true;

            return (
              <div key={session.sessionId} className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-sm transition-all">
                {/* Session Header */}
                <div 
                  onClick={() => toggleSession(session.sessionId)}
                  className="px-4 md:px-6 py-4 bg-surface-variant/50 hover:bg-surface-variant flex items-center justify-between cursor-pointer border-b border-surface-border flex-wrap gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-background border border-surface-border rounded-xl flex items-center justify-center font-bold text-foreground shadow-sm">
                      T{session.tableNumber}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-bold text-foreground text-base md:text-lg truncate">Table {session.tableNumber}</h2>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] md:text-xs text-secondary font-medium overflow-hidden">
                        <span className="uppercase tracking-wider shrink-0">Session</span>
                        <span className="shrink-0">•</span>
                        <span className="font-mono truncate">{session.sessionId.split('_')[1] || session.sessionId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-8 ml-auto">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-secondary uppercase font-semibold tracking-wider">Session Total</p>
                      <p className="font-bold text-foreground text-lg">{formatRupiah(session.total)}</p>
                    </div>
                    <div>
                      <span className={cn(
                        "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md border",
                        allPaid ? 'bg-green-100 text-green-800 border-green-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                      )}>
                        {allPaid ? 'PAID' : 'UNPAID'}
                      </span>
                    </div>
                    <button className="p-2 text-secondary hover:bg-surface-border rounded-lg transition-colors">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Session Details (Individual Orders) */}
                {isExpanded && (
                  <div className="divide-y divide-surface-border bg-background">
                    {session.orders.map((order: any) => (
                      <div key={order.id} className={`px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-variant/30 transition-colors ${order.status === 'CANCELLED' ? 'opacity-50 grayscale' : ''}`}>
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className={`font-bold text-sm truncate ${order.status === 'CANCELLED' ? 'line-through text-secondary' : 'text-foreground'}`}>{order.orderNumber}</span>
                          <span className="text-xs text-secondary">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6 shrink-0">
                          <span className={`font-medium text-sm ${order.status === 'CANCELLED' ? 'line-through text-secondary' : 'text-foreground'}`}>{formatRupiah(order.total)}</span>
                          <span className={cn(
                            "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border",
                            order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                          )}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-surface-variant text-secondary border-b border-surface-border tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Table</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {filteredOrders.map((order: any) => (
                    <tr key={order.id} className={`hover:bg-surface-variant/50 transition-colors ${order.status === 'CANCELLED' ? 'opacity-50 grayscale' : ''}`}>
                      <td className={`px-6 py-4 font-medium ${order.status === 'CANCELLED' ? 'line-through text-secondary' : 'text-foreground'}`}>
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        Table {order.table?.tableNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-secondary">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className={`px-6 py-4 font-medium ${order.status === 'CANCELLED' ? 'line-through text-secondary' : 'text-foreground'}`}>
                        {formatRupiah(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border",
                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-200' :
                          order.status === 'READY' ? 'bg-[#97E7BC] text-[#064E3B] border-[#34D399]' :
                          order.status === 'PREPARING' ? 'bg-[#99AFD2] text-[#1E3A8A] border-[#60A5FA]' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800 border-red-200' :
                          'bg-surface-variant text-secondary border-surface-border'
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border",
                          order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                        )}>
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
