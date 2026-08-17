import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AKC Library Cafe...");

  // 1. Upsert Restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "akc-library-cafe" },
    update: {
      name: "AKC Library Cafe",
      description: "A cozy library cafe experience with great food and coffee.",
      taxRate: 10,
      serviceChargeRate: 5,
    },
    create: {
      name: "AKC Library Cafe",
      slug: "akc-library-cafe",
      description: "A cozy library cafe experience with great food and coffee.",
      taxRate: 10,
      serviceChargeRate: 5,
    },
  });
  console.log(`✅ Restaurant: ${restaurant.name} (${restaurant.id})`);

  // 2. Delete old categories (will cascade delete products)
  await prisma.category.deleteMany({ where: { restaurantId: restaurant.id } });
  console.log("🗑️  Cleared old categories & products");

  // 3. Seed tables if none exist
  const tableCount = await prisma.table.count({ where: { restaurantId: restaurant.id } });
  if (tableCount === 0) {
    await prisma.table.createMany({
      data: Array.from({ length: 20 }, (_, i) => ({
        restaurantId: restaurant.id,
        tableNumber: String(i + 1),
      })),
    });
    console.log("🪑 Created 20 tables");
  }

  // 4. Define categories and products
  const menuData = [
    {
      name: "🍳 Breakfast (All Day)",
      sortOrder: 1,
      products: [
        { name: "Big Breakfast", description: "Egg, sausages, beans, potatoes", price: 70000 },
        { name: "French Toast", description: "Classic golden French toast", price: 65000 },
        { name: "Nasi Goreng Kampung", description: "Traditional Indonesian fried rice", price: 55000 },
        { name: "Lontong Sayur", description: "Rice cake with vegetable coconut milk soup", price: 75000 },
      ],
    },
    {
      name: "🥗 Salad",
      sortOrder: 2,
      products: [
        { name: "AKC Caesar Salad", description: "Crispy romaine, parmesan, croutons, caesar dressing", price: 65000 },
        { name: "Thai Beef Salad", description: "Grilled beef with fresh herbs and Thai dressing", price: 85000 },
      ],
    },
    {
      name: "🍛 Mains",
      sortOrder: 3,
      products: [
        { name: "Rawon", description: "East Javanese black beef soup with kluwek", price: 95000 },
        { name: "Sop Buntut", description: "Rich oxtail soup with vegetables", price: 175000 },
        { name: "Dendeng Balado \"Ibu Zumi\"", description: "Crispy beef with spicy rendang-style balado", price: 75000 },
        { name: "Ayam Balado \"Ibu Zumi\"", description: "Chicken with authentic balado chili sauce", price: 65000 },
        { name: "Udang Balado \"Ibu Zumi\"", description: "Prawns with spicy balado sauce", price: 65000 },
        { name: "Sate Maranggi", description: "Skewered marinated beef, West Javanese style", price: 135000 },
        { name: "Sup Salmon Asam Pedas", description: "Salmon in sour and spicy broth", price: 110000 },
        { name: "Nasi Goreng Ikan Asin", description: "Fried rice with salted fish", price: 50000 },
      ],
    },
    {
      name: "🍝 Pasta & Grill",
      sortOrder: 4,
      products: [
        { name: "Pasta Bolognese", description: "Spaghetti with slow-cooked meat ragù", price: 65000 },
        { name: "Pasta Crema di Funghi", description: "Fettuccine with creamy mushroom sauce", price: 85000 },
        { name: "Pasta Aglio Olio", description: "Spaghetti with garlic, olive oil, and chili", price: 55000 },
        { name: "Lasagna Al Ragu", description: "Classic baked lasagna with meat ragù", price: 65000 },
        { name: "Salmon Steak", description: "Pan-seared salmon fillet with seasonal sides", price: 195000 },
        { name: "Salmon Encroute", description: "Salmon wrapped in puff pastry", price: 150000 },
        { name: "Chicken Steak", description: "Grilled chicken breast with herbs and sauce", price: 95000 },
        { name: "Pollo alla Milanese", description: "Milanese-style breaded chicken cutlet", price: 85000 },
      ],
    },
    {
      name: "🍟 Finger Food",
      sortOrder: 5,
      products: [
        { name: "Truffle French Fries", description: "Crispy fries with truffle oil and parmesan", price: 45000 },
        { name: "Chicken Basket", description: "Crispy fried chicken pieces basket", price: 70000 },
        { name: "Otak Otak", description: "Grilled fish cake wrapped in banana leaf", price: 50000 },
        { name: "Bakwan Jagung", description: "Crispy sweet corn fritters", price: 30000 },
        { name: "Mendoan", description: "Soft fried thin tempeh with spicy dipping", price: 25000 },
        { name: "Pisang Goreng", description: "Crispy fried banana", price: 30000 },
        { name: "Rujak Cireng", description: "Fried starchy cakes with peanut rujak sauce", price: 30000 },
        { name: "Gorengan Platter", description: "Assorted Indonesian fried snacks", price: 55000 },
      ],
    },
    {
      name: "🍮 Dessert",
      sortOrder: 6,
      products: [
        { name: "Caramel Pudding", description: "Silky smooth caramel custard pudding", price: 35000 },
        { name: "Lava Cake", description: "Warm chocolate lava cake", price: 55000 },
        { name: "Cookie Bomb", description: "Loaded chocolate chip cookie bomb", price: 55000 },
        { name: "Vanilla Ice Cream (Add On)", description: "Scoop of vanilla ice cream as an add-on", price: 5000 },
      ],
    },
    {
      name: "☕ Coffee",
      sortOrder: 7,
      products: [
        { name: "Espresso", description: "Short, intense espresso shot", price: 25000 },
        { name: "Americano (Hot)", description: "Espresso with hot water", price: 25000 },
        { name: "Americano (Iced)", description: "Espresso with cold water and ice", price: 30000 },
        { name: "Cappuccino (Hot)", description: "Espresso with steamed milk foam", price: 30000 },
        { name: "Cappuccino (Iced)", description: "Iced cappuccino", price: 35000 },
        { name: "Café Latte (Hot)", description: "Espresso with steamed milk", price: 30000 },
        { name: "Café Latte (Iced)", description: "Iced café latte", price: 35000 },
        { name: "Brown Sugar Latte", description: "Latte with caramelized brown sugar", price: 35000 },
        { name: "Vanilla Latte", description: "Latte with vanilla syrup", price: 35000 },
        { name: "Caramel Latte", description: "Latte with caramel sauce", price: 35000 },
        { name: "Mont Blanc", description: "Signature coffee with chestnut notes", price: 40000 },
        { name: "Vienna Coffee", description: "Espresso topped with whipped cream", price: 40000 },
        { name: "Dirty Matcha", description: "Espresso shot over iced matcha latte", price: 40000 },
        { name: "Matcha Latte (Iced)", description: "Creamy iced matcha milk", price: 35000 },
        { name: "Matcha Latte (Hot)", description: "Warm matcha with steamed milk", price: 40000 },
        { name: "Matcha Frappe", description: "Blended matcha frappe", price: 40000 },
      ],
    },
    {
      name: "🍵 Tea",
      sortOrder: 8,
      products: [
        { name: "Black Tea (Hot)", description: "Classic brewed black tea", price: 20000 },
        { name: "Black Tea (Iced)", description: "Chilled black tea", price: 25000 },
        { name: "Flavoured Iced Tea - Lychee", description: "Refreshing lychee iced tea", price: 35000 },
        { name: "Flavoured Iced Tea - Peach", description: "Refreshing peach iced tea", price: 35000 },
        { name: "Flavoured Iced Tea - Lemon", description: "Refreshing lemon iced tea", price: 35000 },
        { name: "Thai Tea", description: "Rich and creamy Thai-style milk tea", price: 35000 },
        { name: "Roasted Oolong Milk Tea", description: "Smooth roasted oolong with milk", price: 35000 },
        { name: "Hot Yuzu Ginger", description: "Warming yuzu and ginger infusion", price: 30000 },
      ],
    },
    {
      name: "🥤 Other Beverages",
      sortOrder: 9,
      products: [
        { name: "Mineral Water Still", description: "500ml still mineral water", price: 40000 },
        { name: "Mineral Water Sparkling", description: "330ml sparkling mineral water", price: 45000 },
        { name: "Soft Drink - Cola", description: "Chilled cola", price: 25000 },
        { name: "Soft Drink - Sprite", description: "Chilled sprite", price: 25000 },
        { name: "Soft Drink - Ginger Ale", description: "Chilled ginger ale", price: 25000 },
      ],
    },
  ];

  // 5. Insert categories and products
  for (const catData of menuData) {
    const category = await prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: catData.name,
        sortOrder: catData.sortOrder,
      },
    });

    await prisma.product.createMany({
      data: catData.products.map((p) => ({
        categoryId: category.id,
        name: p.name,
        description: p.description,
        price: p.price,
        isAvailable: true,
      })),
    });

    console.log(`  📂 ${catData.name}: ${catData.products.length} items`);
  }

  console.log("\n🎉 Done! AKC Library Cafe seeded successfully.");
  console.log(`   Slug: akc-library-cafe`);
  console.log(`   Admin URL: /admin`);
  console.log(`   Customer URL: /r/akc-library-cafe/table/1`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
