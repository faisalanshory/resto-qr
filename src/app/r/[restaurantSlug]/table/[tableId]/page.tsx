import { db } from "@/lib/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import ClientMenu from "./client-menu";

export default async function CustomerMenuPage({
  params,
}: {
  params: { restaurantSlug: string; tableId: string };
}) {
  const restaurant = await db.restaurant.findUnique({
    where: { slug: params.restaurantSlug },
    include: {
      categories: {
        orderBy: { sortOrder: "asc" },
        include: {
          products: {
            where: { isAvailable: true },
            include: {
              variants: true,
              addons: true,
            },
          },
        },
      },
    },
  });

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Client Component to handle categories scrolling and filtering */}
      <ClientMenu categories={restaurant.categories} />
    </div>
  );
}
