import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ClientPayment from "./client-payment";

export default async function PaymentSimulationServerPage({
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
    <ClientPayment 
      restaurantSlug={params.restaurantSlug} 
      tableNumber={params.tableId}
      restaurantId={restaurant.id}
      tableId={table.id}
      taxRate={restaurant.taxRate}
      serviceChargeRate={restaurant.serviceChargeRate}
    />
  );
}
