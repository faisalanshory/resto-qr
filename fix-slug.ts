import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const restaurant = await prisma.restaurant.findUnique({ where: { slug: "akc-library-cafe" } });
  console.log("Restaurant:", restaurant?.id, restaurant?.name);
  
  const tableCount = await prisma.table.count({ where: { restaurantId: restaurant!.id } });
  console.log("Table count:", tableCount);
  
  const tables = await prisma.table.findMany({ where: { restaurantId: restaurant!.id }, take: 5 });
  console.log("Tables:", JSON.stringify(tables, null, 2));
  
  await prisma.$disconnect();
}
main().catch(console.error);
