import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export async function GET() {
  try {
    const orders = await db.order.findMany({
      where: {
        status: {
          notIn: [OrderStatus.NEW, OrderStatus.PREPARING],
        },
      },
      include: {
        table: true,
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit to recent 50 for POC
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching order history:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
