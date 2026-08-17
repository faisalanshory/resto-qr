import ClientBill from "./client-bill";

export default function BillPage({
  params,
}: {
  params: { restaurantSlug: string; tableId: string };
}) {
  return <ClientBill restaurantSlug={params.restaurantSlug} tableNumber={params.tableId} />;
}
