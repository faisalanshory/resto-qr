import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ClientOrder from "./client-order";

export default async function CustomerOrderPage({
  params,
}: {
  params: { restaurantSlug: string; tableId: string; orderId: string };
}) {
  const order = await db.order.findUnique({
    where: { id: params.orderId },
    include: {
      items: {
        include: {
          product: true,
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full bg-surface">
      <ClientOrder 
        initialOrder={order} 
        restaurantSlug={params.restaurantSlug}
        tableNumber={params.tableId}
      />
    </div>
  );
}
