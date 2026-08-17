import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ClientCart from "./client-cart";

export default async function CustomerCartPage({
  params,
}: {
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
    <div className="flex flex-col h-full bg-surface">
      <ClientCart 
        restaurantId={restaurant.id} 
        tableId={table.id} 
        restaurantSlug={params.restaurantSlug} 
        tableNumber={params.tableId} 
        taxRate={restaurant.taxRate}
        serviceChargeRate={restaurant.serviceChargeRate}
      />
    </div>
  );
}
