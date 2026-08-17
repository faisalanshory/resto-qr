import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const tables = await db.table.findMany({
      include: {
        orders: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        },
        restaurant: {
          select: {
            taxRate: true,
            serviceChargeRate: true,
          }
        }
      },
      orderBy: {
        tableNumber: "asc",
      },
    });

    return NextResponse.json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
