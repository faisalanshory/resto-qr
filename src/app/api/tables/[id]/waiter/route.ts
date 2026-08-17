import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const tableNumber = params.id;
    const body = await req.json();
    const { needsWaiter } = body;

    const table = await db.table.findFirst({
      where: { tableNumber }
    });

    if (!table) return new NextResponse("Not Found", { status: 404 });

    const updated = await db.table.update({
      where: { id: table.id },
      data: { needsWaiter },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating waiter status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
