import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export async function GET() {
  try {
    const orders = await db.order.findMany({
      where: {
        status: {
          in: [OrderStatus.NEW, OrderStatus.PREPARING],
        },
      },
      include: {
        table: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching KDS orders:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
