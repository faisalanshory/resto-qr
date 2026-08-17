import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      restaurantId,
      tableId,
      restaurantSlug,
      tableNumber,
      items,
      subtotal,
      tax,
      serviceCharge,
      total,
      paymentStatus,
      paymentMethod,
      customerSessionId: clientSessionId,
    } = body;

    // Generate Order Number
    const orderNumber = `#${randomBytes(3).toString("hex").toUpperCase()}`;
    const customerSessionId = clientSessionId || `session_${randomBytes(8).toString("hex")}`;

    let finalRestaurantId = restaurantId;
    let finalTableId = tableId;

    if (!finalRestaurantId || !finalTableId) {
      if (restaurantSlug && tableNumber) {
        const restaurant = await db.restaurant.findUnique({ where: { slug: restaurantSlug }});
        if (!restaurant) return new NextResponse("Restaurant not found", { status: 404 });
        const table = await db.table.findUnique({ where: { restaurantId_tableNumber: { restaurantId: restaurant.id, tableNumber: tableNumber } }});
        if (!table) return new NextResponse("Table not found", { status: 404 });
        finalRestaurantId = restaurant.id;
        finalTableId = table.id;
      } else {
        return new NextResponse("Missing IDs", { status: 400 });
      }
    }

    const order = await db.order.create({
      data: {
        restaurantId: finalRestaurantId,
        tableId: finalTableId,
        orderNumber,
        customerSessionId,
        subtotal,
        tax,
        serviceCharge,
        total,
        status: OrderStatus.NEW,
        paymentStatus: paymentStatus as PaymentStatus,
        paymentMethod,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            modifiers: JSON.stringify({
              variants: item.variants,
              addons: item.addons,
            }),
            notes: item.notes,
          })),
        },
      },
    });

    return NextResponse.json({ orderId: order.id, orderNumber });
  } catch (error) {
    console.error("Error creating order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
