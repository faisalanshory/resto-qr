import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// For demo purposes, we just fetch the first restaurant (Kopi Senja)
export async function GET() {
  try {
    const restaurant = await db.restaurant.findFirst();
    if (!restaurant) return new NextResponse("Not Found", { status: 404 });
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { name, description, taxRate, serviceChargeRate } = body;

    const restaurant = await db.restaurant.findFirst();
    if (!restaurant) return new NextResponse("Not Found", { status: 404 });

    const updated = await db.restaurant.update({
      where: { id: restaurant.id },
      data: {
        name,
        description,
        taxRate: parseFloat(taxRate),
        serviceChargeRate: parseFloat(serviceChargeRate),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating settings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
