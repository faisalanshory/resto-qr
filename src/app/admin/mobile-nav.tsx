"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UtensilsCrossed, Receipt, LayoutDashboard, Settings, Menu, X } from "lucide-react";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/admin/kitchen", icon: UtensilsCrossed, label: "Kitchen Display" },
    { href: "/admin/orders", icon: Receipt, label: "Order History" },
    { href: "/admin/menu", icon: LayoutDashboard, label: "Menu Management" },
    { href: "/admin/tables", icon: UtensilsCrossed, label: "Table Management" },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 md:hidden text-foreground hover:bg-surface-variant rounded-md"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative flex flex-col w-64 max-w-[80vw] h-full bg-surface border-r border-surface-border shadow-xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between p-6 border-b border-surface-border/50">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-primary">AKC Library Cafe</h1>
                <p className="text-xs text-secondary mt-1">Admin Panel</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-secondary hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                      isActive ? "bg-primary/10 text-primary font-bold" : "text-foreground hover:bg-surface-variant/50 font-medium"
                    }`}>
                      <link.icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-surface-border/50">
              <Link 
                href="/admin/settings"
                onClick={() => setIsOpen(false)}
              >
                <button className={`flex items-center gap-3 px-4 py-3 w-full rounded-md transition-colors ${
                  pathname === "/admin/settings" ? "bg-primary/10 text-primary font-bold" : "text-foreground hover:bg-surface-variant/50 font-medium"
                }`}>
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
