import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status } = body;

    if (!["AVAILABLE", "OCCUPIED", "RESERVED"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const updated = await db.table.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating table status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
