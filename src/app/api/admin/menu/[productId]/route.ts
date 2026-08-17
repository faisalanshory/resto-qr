import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { productId: string } }) {
  try {
    const body = await req.json();
    
    // Support toggling availability
    if (typeof body.isAvailable === "boolean") {
      const updated = await db.product.update({
        where: { id: params.productId },
        data: { isAvailable: body.isAvailable },
      });
      return NextResponse.json(updated);
    }
    
    return new NextResponse("Invalid request", { status: 400 });
  } catch (error) {
    console.error("Error updating product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
