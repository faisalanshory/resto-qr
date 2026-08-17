import Link from "next/link";
import { UtensilsCrossed, Receipt, LayoutDashboard, Settings } from "lucide-react";
import { MobileNav } from "./mobile-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-surface-on overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-surface-border bg-surface shrink-0 z-10">
        <h1 className="text-lg font-bold tracking-tight text-primary">AKC Library Cafe Admin</h1>
        <MobileNav />
      </header>

      {/* Desktop Navigation Rail / Sidebar */}
      <aside className="hidden md:flex w-64 bg-surface border-r border-surface-variant flex-col shrink-0">
        <div className="p-6 border-b border-surface-variant/50">
          <h1 className="text-xl font-bold tracking-tight text-primary">AKC Library Cafe Admin</h1>
          <p className="text-sm text-secondary mt-1">Management Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard">
            <div className="flex items-center gap-3 px-4 py-3 rounded-m3-md hover:bg-surface-variant/50 transition-colors">
              <LayoutDashboard className="w-5 h-5 text-secondary" />
              <span className="font-medium">Overview</span>
            </div>
          </Link>
          <Link href="/admin/kitchen">
            <div className="flex items-center gap-3 px-4 py-3 rounded-m3-md hover:bg-surface-variant/50 transition-colors">
              <UtensilsCrossed className="w-5 h-5 text-secondary" />
              <span className="font-medium">Kitchen Display</span>
            </div>
          </Link>
          <Link href="/admin/orders">
            <div className="flex items-center gap-3 px-4 py-3 rounded-m3-md hover:bg-surface-variant/50 transition-colors">
              <Receipt className="w-5 h-5 text-secondary" />
              <span className="font-medium">Order History</span>
            </div>
          </Link>
          <Link href="/admin/menu">
            <div className="flex items-center gap-3 px-4 py-3 rounded-m3-md hover:bg-surface-variant/50 transition-colors">
              <LayoutDashboard className="w-5 h-5 text-secondary" />
              <span className="font-medium">Menu Management</span>
            </div>
          </Link>
          <Link href="/admin/tables">
            <div className="flex items-center gap-3 px-4 py-3 rounded-m3-md hover:bg-surface-variant/50 transition-colors">
              <UtensilsCrossed className="w-5 h-5 text-secondary" />
              <span className="font-medium">Table Management</span>
            </div>
          </Link>
        </nav>

        <div className="p-4 border-t border-surface-variant/50">
          <Link href="/admin/settings">
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-m3-md hover:bg-surface-variant/50 transition-colors">
              <Settings className="w-5 h-5 text-secondary" />
              <span className="font-medium">Settings</span>
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
