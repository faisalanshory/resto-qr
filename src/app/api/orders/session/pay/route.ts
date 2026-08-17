import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PaymentStatus } from "@prisma/client";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, paymentMethod } = body;

    if (!sessionId) {
      return new NextResponse("Missing sessionId", { status: 400 });
    }

    // Update all pending orders for this session to PAID
    await db.order.updateMany({
      where: {
        customerSessionId: sessionId,
        paymentStatus: {
          not: PaymentStatus.PAID
        }
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: paymentMethod || "QRIS",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error paying session orders:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
