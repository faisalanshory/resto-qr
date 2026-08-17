import ClientKDS from "./client-kds";

export default function KitchenPage() {
  return (
    <div className="h-full flex flex-col bg-surface-variant/20">
      <div className="p-6 border-b border-surface-variant bg-surface flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kitchen Display System</h2>
          <p className="text-secondary text-sm">Manage incoming and preparing orders</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm font-medium"><span className="w-3 h-3 rounded-full bg-error"></span> New</span>
          <span className="flex items-center gap-2 text-sm font-medium"><span className="w-3 h-3 rounded-full bg-[#E5B513]"></span> Preparing</span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-6">
        <ClientKDS />
      </div>
    </div>
  );
}
