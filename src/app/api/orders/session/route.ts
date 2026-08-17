import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const tableId = searchParams.get("tableId");

    if (!sessionId || !tableId) {
      return new NextResponse("Missing sessionId or tableId", { status: 400 });
    }

    const orders = await db.order.findMany({
      where: {
        customerSessionId: sessionId,
        table: { tableNumber: tableId },
      },
      include: {
        items: {
          include: {
            product: true,
          }
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching session orders:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
