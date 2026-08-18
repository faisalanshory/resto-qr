import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: "akc-library-cafe" },
  });

  if (!restaurant) {
    console.log("Restaurant not found!");
    return;
  }

  // Get all tables for this restaurant
  const allTables = await prisma.table.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: [{ tableNumber: "asc" }, { createdAt: "asc" }],
    include: { orders: { select: { id: true } } },
  });

  console.log(`Found ${allTables.length} tables total`);

  // Group by tableNumber to find duplicates
  const grouped: Record<string, typeof allTables> = {};
  for (const t of allTables) {
    if (!grouped[t.tableNumber]) grouped[t.tableNumber] = [];
    grouped[t.tableNumber].push(t);
  }

  // Delete all tables (duplicates + extras beyond 10)
  const toDelete: string[] = [];
  const toKeep: string[] = [];

  // For each number 1-10, keep only the first/oldest entry
  for (let i = 1; i <= 10; i++) {
    const num = String(i);
    const group = grouped[num] || [];
    if (group.length === 0) continue;
    // Keep the first (oldest), delete the rest
    toKeep.push(group[0].id);
    for (let j = 1; j < group.length; j++) {
      toDelete.push(group[j].id);
    }
  }

  // Any table with tableNumber > 10, delete them all
  for (const [num, group] of Object.entries(grouped)) {
    if (parseInt(num) > 10) {
      for (const t of group) toDelete.push(t.id);
    }
  }

  console.log(`Keeping ${toKeep.length} tables (1–10)`);
  console.log(`Deleting ${toDelete.length} tables (duplicates + extras)`);

  if (toDelete.length > 0) {
    await prisma.table.deleteMany({ where: { id: { in: toDelete } } });
  }

  // Ensure we have exactly tables 1-10
  const existing = await prisma.table.findMany({
    where: { restaurantId: restaurant.id },
    select: { tableNumber: true },
  });
  const existingNums = new Set(existing.map((t) => t.tableNumber));

  for (let i = 1; i <= 10; i++) {
    const num = String(i);
    if (!existingNums.has(num)) {
      await prisma.table.create({
        data: { restaurantId: restaurant.id, tableNumber: num },
      });
      console.log(`  Created missing table ${num}`);
    }
  }

  const final = await prisma.table.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { tableNumber: "asc" },
    select: { tableNumber: true, status: true },
  });

  console.log("\n✅ Final tables:");
  final.forEach((t) => console.log(`  Table ${t.tableNumber} — ${t.status}`));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
