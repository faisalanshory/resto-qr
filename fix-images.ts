import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Gambar dari Unsplash untuk setiap menu item
const imageMap: Record<string, string> = {
  // Breakfast
  "Big Breakfast": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80",
  "French Toast": "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80",
  "Nasi Goreng Kampung": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80",
  "Lontong Sayur": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80",

  // Salad
  "AKC Caesar Salad": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80",
  "Thai Beef Salad": "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&q=80",

  // Mains
  "Rawon": "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80",
  "Sop Buntut": "https://images.unsplash.com/photo-1504544750208-dc0358e13f30?w=400&q=80",
  'Dendeng Balado "Ibu Zumi"': "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=400&q=80",
  'Ayam Balado "Ibu Zumi"': "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80",
  'Udang Balado "Ibu Zumi"': "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "Sate Maranggi": "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80",
  "Sup Salmon Asam Pedas": "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80",
  "Nasi Goreng Ikan Asin": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80",

  // Pasta & Grill
  "Pasta Bolognese": "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80",
  "Pasta Crema di Funghi": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80",
  "Pasta Aglio Olio": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80",
  "Lasagna Al Ragu": "https://images.unsplash.com/photo-1560781290-7dc94c0f8f4f?w=400&q=80",
  "Salmon Steak": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
  "Salmon Encroute": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
  "Chicken Steak": "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&q=80",
  "Pollo alla Milanese": "https://images.unsplash.com/photo-1598515213692-c8b1e9b9b2c3?w=400&q=80",

  // Finger Food
  "Truffle French Fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
  "Chicken Basket": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  "Otak Otak": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
  "Bakwan Jagung": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80",
  "Mendoan": "https://images.unsplash.com/photo-1574484284002-952d92a03a52?w=400&q=80",
  "Pisang Goreng": "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&q=80",
  "Rujak Cireng": "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400&q=80",
  "Gorengan Platter": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",

  // Dessert
  "Caramel Pudding": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80",
  "Lava Cake": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
  "Cookie Bomb": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80",
  "Vanilla Ice Cream (Add On)": "https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=400&q=80",

  // Coffee
  "Espresso": "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&q=80",
  "Americano (Hot)": "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=400&q=80",
  "Americano (Iced)": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
  "Cappuccino (Hot)": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80",
  "Cappuccino (Iced)": "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=80",
  "Café Latte (Hot)": "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&q=80",
  "Café Latte (Iced)": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80",
  "Brown Sugar Latte": "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&q=80",
  "Vanilla Latte": "https://images.unsplash.com/photo-1587080266227-677cc2a4e76e?w=400&q=80",
  "Caramel Latte": "https://images.unsplash.com/photo-1523765629978-6a6f8bb7fb3f?w=400&q=80",
  "Mont Blanc": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
  "Vienna Coffee": "https://images.unsplash.com/photo-1519743985708-3d281e64d4db?w=400&q=80",
  "Dirty Matcha": "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80",
  "Matcha Latte (Iced)": "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=400&q=80",
  "Matcha Latte (Hot)": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  "Matcha Frappe": "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&q=80",

  // Tea
  "Black Tea (Hot)": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80",
  "Black Tea (Iced)": "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&q=80",
  "Flavoured Iced Tea - Lychee": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  "Flavoured Iced Tea - Peach": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  "Flavoured Iced Tea - Lemon": "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80",
  "Thai Tea": "https://images.unsplash.com/photo-1593443320739-77f74939d0da?w=400&q=80",
  "Roasted Oolong Milk Tea": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "Hot Yuzu Ginger": "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=80",

  // Beverages
  "Mineral Water Still": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80",
  "Mineral Water Sparkling": "https://images.unsplash.com/photo-1624552184280-9e9507e9c9e9?w=400&q=80",
  "Soft Drink - Cola": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
  "Soft Drink - Sprite": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
  "Soft Drink - Ginger Ale": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&q=80",
};

async function main() {
  let updated = 0;
  let notFound = 0;

  for (const [name, imageUrl] of Object.entries(imageMap)) {
    const result = await prisma.product.updateMany({
      where: { name, imageUrl: null },
      data: { imageUrl },
    });
    if (result.count > 0) {
      console.log(`✅ ${name}`);
      updated++;
    } else {
      // Try without checking imageUrl null (might already have one)
      const exists = await prisma.product.findFirst({ where: { name } });
      if (!exists) {
        console.log(`❌ NOT FOUND: ${name}`);
        notFound++;
      } else {
        console.log(`⏭️  SKIP (already has image): ${name}`);
      }
    }
  }

  console.log(`\n✅ Updated: ${updated}, ❌ Not found: ${notFound}`);
  await prisma.$disconnect();
}

main().catch(console.error);
