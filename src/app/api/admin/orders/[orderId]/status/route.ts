import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export async function PATCH(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const body = await req.json();
    const { status } = body;

    const order = await db.order.update({
      where: { id: params.orderId },
      data: { status: status as OrderStatus },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
