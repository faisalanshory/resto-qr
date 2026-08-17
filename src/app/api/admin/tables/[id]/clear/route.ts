import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const tableId = params.id;

    // Clear the active session and set status back to AVAILABLE
    await db.table.update({
      where: { id: tableId },
      data: {
        activeSessionId: null,
        status: "AVAILABLE",
      },
    });

    // We don't delete the orders, they remain in the database for history
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing table session:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
