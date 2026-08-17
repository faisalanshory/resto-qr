import { PrismaClient } from '@prisma/client';
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding QR-Resto database...');

  // 1. Create Restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'kopi-senja' },
    update: {},
    create: {
      name: 'Kopi Senja',
      slug: 'kopi-senja',
      description: 'Modern Indonesian coffee shop & casual dining',
    },
  });

  // 2. Create Tables (1 to 20)
  for (let i = 1; i <= 20; i++) {
    const tableNum = String(i).padStart(2, '0');
    await prisma.table.upsert({
      where: { restaurantId_tableNumber: { restaurantId: restaurant.id, tableNumber: tableNum } },
      update: {},
      create: {
        restaurantId: restaurant.id,
        tableNumber: tableNum,
      },
    });
  }

  // 3. Create Categories
  const categoriesData = [
    { name: 'Mains', sortOrder: 1 },
    { name: 'Snack', sortOrder: 2 },
    { name: 'Coffee', sortOrder: 3 },
    { name: 'Non Coffee', sortOrder: 4 },
    { name: 'Desserts', sortOrder: 5 },
  ];

  const createdCategories = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: cat.name,
        sortOrder: cat.sortOrder,
      }
    });
    createdCategories[cat.name] = createdCat;
  }

  // 4. Create Products
  const productsData = [
    // MAINS
    {
      category: 'Mains',
      name: 'Nasi Goreng Special',
      description: 'Spicy fried rice with chicken, egg and vegetables.',
      price: 38000,
      imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80',
      variants: [{ name: 'Spice Level', options: '["Normal", "Medium", "Spicy"]' }],
      addons: [{ name: 'Extra Egg', price: 7000 }, { name: 'Extra Chicken', price: 12000 }, { name: 'Extra Cheese', price: 8000 }]
    },
    {
      category: 'Mains',
      name: 'Chicken Rice Bowl',
      description: 'Rice bowl with crispy chicken and signature sauce.',
      price: 45000,
      imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Mains',
      name: 'Beef Black Pepper Rice',
      description: 'Tender beef slices with black pepper sauce.',
      price: 65000,
      imageUrl: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Mains',
      name: 'Chicken Teriyaki Rice',
      description: 'Grilled chicken with teriyaki glaze.',
      price: 42000,
      imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Mains',
      name: 'Spaghetti Bolognese',
      description: 'Classic Italian pasta with beef ragu.',
      price: 50000,
      imageUrl: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=500&q=80',
    },

    // SNACK
    {
      category: 'Snack',
      name: 'French Fries',
      description: 'Crispy shoestring fries.',
      price: 25000,
      imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Snack',
      name: 'Chicken Wings',
      description: 'Spicy buffalo wings (6 pieces).',
      price: 35000,
      imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Snack',
      name: 'Chicken Popcorn',
      description: 'Bite-sized crispy chicken.',
      price: 30000,
      imageUrl: 'https://images.unsplash.com/photo-1562967914-01efa7e87832?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Snack',
      name: 'Mozzarella Sticks',
      description: 'Deep fried cheese sticks with marinara.',
      price: 32000,
      imageUrl: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Snack',
      name: 'Pisang Goreng',
      description: 'Indonesian fried banana with cheese and chocolate.',
      price: 22000,
      imageUrl: 'https://images.unsplash.com/photo-1626074964464-f6551b38f830?auto=format&fit=crop&w=500&q=80',
    },

    // COFFEE
    {
      category: 'Coffee',
      name: 'Iced Coffee Milk',
      description: 'Signature palm sugar iced coffee.',
      price: 25000,
      imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=500&q=80',
      variants: [{ name: 'Sweetness', options: '["Normal", "Less Sweet", "No Sugar"]' }]
    },
    {
      category: 'Coffee',
      name: 'Cafe Latte',
      description: 'Espresso with steamed milk.',
      price: 30000,
      imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Coffee',
      name: 'Americano',
      description: 'Classic black coffee.',
      price: 20000,
      imageUrl: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Coffee',
      name: 'Caramel Macchiato',
      description: 'Espresso, milk, and caramel drizzle.',
      price: 35000,
      imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Coffee',
      name: 'Hazelnut Latte',
      description: 'Latte with hazelnut syrup.',
      price: 32000,
      imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=500&q=80',
    },

    // NON COFFEE
    {
      category: 'Non Coffee',
      name: 'Matcha Latte',
      description: 'Premium Japanese green tea with milk.',
      price: 32000,
      imageUrl: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Non Coffee',
      name: 'Lychee Tea',
      description: 'Sweet iced tea with whole lychee fruit.',
      price: 25000,
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Non Coffee',
      name: 'Lemon Tea',
      description: 'Refreshing iced lemon tea.',
      price: 20000,
      imageUrl: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Non Coffee',
      name: 'Strawberry Milk',
      description: 'Fresh milk with homemade strawberry puree.',
      price: 28000,
      imageUrl: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Non Coffee',
      name: 'Mineral Water',
      description: 'Bottled water (600ml).',
      price: 10000,
      imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=500&q=80',
    },

    // DESSERTS
    {
      category: 'Desserts',
      name: 'Chocolate Brownie',
      description: 'Fudgy brownie with vanilla ice cream.',
      price: 30000,
      imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Desserts',
      name: 'Cheesecake',
      description: 'New York style classic cheesecake.',
      price: 35000,
      imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Desserts',
      name: 'Tiramisu',
      description: 'Coffee-flavored Italian dessert.',
      price: 38000,
      imageUrl: 'https://images.unsplash.com/photo-1571115177098-24de4120eb5a?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Desserts',
      name: 'Waffle',
      description: 'Belgian waffle with maple syrup and berries.',
      price: 32000,
      imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f5f14?auto=format&fit=crop&w=500&q=80',
    },
    {
      category: 'Desserts',
      name: 'Ice Cream',
      description: 'Two scoops of your choice.',
      price: 25000,
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c8e9e5cb?auto=format&fit=crop&w=500&q=80',
      variants: [{ name: 'Flavor', options: '["Vanilla", "Chocolate", "Strawberry"]' }]
    },
  ];

  for (const item of productsData) {
    const category = createdCategories[item.category];
    const product = await prisma.product.create({
      data: {
        categoryId: category.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
      }
    });

    if (item.variants) {
      for (const variant of item.variants) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            name: variant.name,
            options: variant.options,
          }
        });
      }
    }

    if (item.addons) {
      for (const addon of item.addons) {
        await prisma.productAddon.create({
          data: {
            productId: product.id,
            name: addon.name,
            price: addon.price,
          }
        });
      }
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
