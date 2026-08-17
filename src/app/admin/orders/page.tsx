import ClientOrders from "./client-orders";

export default function AdminOrdersPage() {
  return (
    <div className="h-full flex flex-col bg-surface-variant/20">
      <div className="p-6 border-b border-surface-variant bg-surface flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Order History</h2>
          <p className="text-secondary text-sm">View past and completed orders</p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-6">
        <ClientOrders />
      </div>
    </div>
  );
}
