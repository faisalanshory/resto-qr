import { db } from "@/lib/db";
import ClientMenuList from "./client-menu-list";

export default async function AdminMenuPage() {
  const categories = await db.category.findMany({
    include: {
      products: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  return <ClientMenuList initialCategories={categories} />;
}
