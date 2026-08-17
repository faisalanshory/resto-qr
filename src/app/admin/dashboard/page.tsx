"use client";

import useSWR from "swr";
import { formatRupiah } from "@/lib/utils";
import { DollarSign, UtensilsCrossed, TrendingUp, Clock, Receipt, LayoutDashboard } from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboardPage() {
  const { data: stats, error } = useSWR("/api/admin/dashboard", fetcher, {
    refreshInterval: 10000,
  });

  if (!stats) return <div className="p-4 sm:p-8 text-secondary">Loading dashboard...</div>;

  return (
    <div className="p-4 sm:p-8 h-full flex flex-col bg-background overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
        <p className="text-secondary mt-1">Monitor your restaurant&apos;s live performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="bg-surface border border-surface-border p-6 rounded-3xl shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/10 text-green-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">Today</span>
          </div>
          <p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-1">Today&apos;s Revenue</p>
          <h2 className="text-3xl font-bold text-foreground">{formatRupiah(stats.todayRevenue)}</h2>
          <p className="text-xs text-secondary mt-4 pt-4 border-t border-surface-border">
            Total All Time: <span className="font-bold text-foreground">{formatRupiah(stats.totalRevenue)}</span>
          </p>
        </div>

        {/* Orders Card */}
        <div className="bg-surface border border-surface-border p-6 rounded-3xl shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-1">Orders Today</p>
          <h2 className="text-3xl font-bold text-foreground">{stats.totalOrdersToday}</h2>
          <p className="text-xs text-secondary mt-4 pt-4 border-t border-surface-border">
            Completed: <span className="font-bold text-green-600">{stats.completedOrders}</span>
          </p>
        </div>

        {/* Active Tables Card */}
        <div className="bg-surface border border-surface-border p-6 rounded-3xl shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
          <p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-1">Active Tables</p>
          <h2 className="text-3xl font-bold text-foreground">{stats.activeTables} <span className="text-lg text-secondary font-medium">/ {stats.totalTables}</span></h2>
          <Link href="/admin/tables" className="mt-4 pt-4 border-t border-surface-border text-xs font-bold text-primary hover:underline uppercase tracking-wider">
            Manage Tables →
          </Link>
        </div>

        {/* Pending Orders Card */}
        <div className="bg-surface border border-surface-border p-6 rounded-3xl shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-500/10 text-red-600 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-1">Pending Kitchen</p>
          <h2 className="text-3xl font-bold text-foreground">{stats.pendingOrders}</h2>
          <Link href="/admin/kitchen" className="mt-4 pt-4 border-t border-surface-border text-xs font-bold text-primary hover:underline uppercase tracking-wider">
            View Kitchen Display →
          </Link>
        </div>
      </div>
    </div>
  );
}
