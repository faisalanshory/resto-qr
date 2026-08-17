import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const tableNumber = params.id; // Usually [tableId] in the url is actually the tableNumber string

    const table = await db.table.findFirst({
      where: { tableNumber },
    });

    if (!table) {
      return new NextResponse("Table not found", { status: 404 });
    }

    return NextResponse.json({ activeSessionId: table.activeSessionId });
  } catch (error) {
    console.error("Error fetching table session:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const tableNumber = params.id;
    const body = await req.json();
    const { newSessionId } = body;

    const table = await db.table.findFirst({
      where: { tableNumber },
    });

    if (!table) {
      return new NextResponse("Table not found", { status: 404 });
    }

    const updated = await db.table.update({
      where: { id: table.id },
      data: {
        activeSessionId: newSessionId,
        status: "OCCUPIED"
      },
    });

    return NextResponse.json({ activeSessionId: updated.activeSessionId });
  } catch (error) {
    console.error("Error updating table session:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
