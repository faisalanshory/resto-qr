import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Search } from "lucide-react";
import Link from "next/link";
import HeaderActions from "./header-actions";
import SessionSync from "./session-sync";

export default async function CustomerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { restaurantSlug: string; tableId: string };
}) {
  const restaurant = await db.restaurant.findUnique({
    where: { slug: params.restaurantSlug },
  });

  if (!restaurant) {
    notFound();
  }

  const table = await db.table.findUnique({
    where: {
      restaurantId_tableNumber: {
        restaurantId: restaurant.id,
        tableNumber: params.tableId,
      },
    },
  });

  if (!table) {
    notFound();
  }

  return (
    <div className="max-w-md mx-auto min-h-[100dvh] bg-background relative shadow-2xl overflow-x-hidden flex flex-col">
      {/* Top App Bar - Minimalist Editorial */}
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-surface-border flex items-center justify-between px-6 h-[72px]">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-foreground">{restaurant.name}</h1>
          <span className="text-[11px] text-secondary font-semibold uppercase tracking-wider mt-0.5">
            TABLE {table.tableNumber} • DINE-IN
          </span>
        </div>
        <HeaderActions tableNumber={params.tableId} />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>

      <SessionSync tableId={params.tableId} />
    </div>
  );
}
