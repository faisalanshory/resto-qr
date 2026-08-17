import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const order = await db.order.findUnique({
      where: { id: params.orderId },
      include: {
        items: {
          include: {
            product: true,
          }
        }
      }
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
