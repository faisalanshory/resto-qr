import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [orders, tables] = await Promise.all([
      db.order.findMany({
        where: { status: { not: "CANCELLED" } },
      }),
      db.table.findMany(),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    const todayOrders = orders.filter(order => new Date(order.createdAt) >= today);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

    const activeTables = tables.filter(table => table.status === "OCCUPIED").length;
    const totalTables = tables.length;

    const completedOrders = orders.filter(o => o.status === "COMPLETED").length;
    const pendingOrders = orders.filter(o => o.status === "NEW" || o.status === "PREPARING").length;

    return NextResponse.json({
      totalRevenue,
      todayRevenue,
      activeTables,
      totalTables,
      totalOrdersToday: todayOrders.length,
      completedOrders,
      pendingOrders,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
