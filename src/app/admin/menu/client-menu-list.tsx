"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { Search, Plus, MoreHorizontal, Check, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ClientMenuList({ initialCategories }: { initialCategories: any[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const toggleAvailability = async (productId: string, currentStatus: boolean) => {
    setIsUpdating(productId);
    try {
      const res = await fetch(`/api/admin/menu/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });
      
      if (res.ok) {
        // Optimistic update
        setCategories(prev => 
          prev.map(cat => ({
            ...cat,
            products: cat.products.map((p: any) => 
              p.id === productId ? { ...p, isAvailable: !currentStatus } : p
            )
          }))
        );
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      alert("Failed to update product");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleAddProduct = () => {
    alert("Add Product feature is coming soon!");
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Menu Management</h1>
          <p className="text-secondary mt-1">Manage your categories and products.</p>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 xs:flex-none">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full sm:w-64 bg-surface border border-surface-border rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground shadow-sm"
            />
          </div>
          <button onClick={handleAddProduct} className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.id} className="bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-surface-variant px-4 sm:px-6 py-4 border-b border-surface-border flex justify-between items-center">
              <h2 className="font-bold text-foreground text-lg truncate pr-2">{category.name}</h2>
              <button className="text-sm font-medium text-primary hover:underline shrink-0">Edit Category</button>
            </div>
            
            <div className="divide-y divide-surface-border">
              {category.products.length === 0 ? (
                <div className="px-6 py-8 text-center text-secondary text-sm">
                  No products in this category.
                </div>
              ) : (
                category.products.map((product: any) => (
                  <div key={product.id} className={`px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-variant/50 transition-colors ${!product.isAvailable ? 'opacity-60' : ''}`}>
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-border">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-secondary text-xs">No Img</div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground flex items-center gap-2">
                          {product.name}
                          {!product.isAvailable && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Sold Out</span>}
                        </h3>
                        <p className="text-secondary text-sm mt-0.5 max-w-md line-clamp-1">
                          {product.description || "No description"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                      <div className="text-left sm:text-right">
                        <span className="font-bold text-foreground text-lg sm:text-base">{formatRupiah(product.price)}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-6 shrink-0">
                        <button 
                        onClick={() => toggleAvailability(product.id, product.isAvailable)}
                        disabled={isUpdating === product.id}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md border flex items-center gap-1.5 transition-colors ${
                          product.isAvailable 
                            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                            : 'bg-surface-variant text-secondary border-surface-border hover:bg-surface-border'
                        }`}
                      >
                        {product.isAvailable ? <><Check className="w-3 h-3" /> Available</> : <><X className="w-3 h-3" /> Unavailable</>}
                      </button>
                      <div className="relative group">
                        <button className="p-2 hover:bg-surface-border rounded-lg transition-colors text-secondary cursor-pointer">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-32 bg-surface border border-surface-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 flex flex-col p-1">
                          <button onClick={() => alert("Edit Feature Coming Soon")} className="text-left px-3 py-2 text-sm text-foreground hover:bg-surface-variant rounded-md">Edit</button>
                          <button onClick={() => toggleAvailability(product.id, product.isAvailable)} className="text-left px-3 py-2 text-sm text-foreground hover:bg-surface-variant rounded-md">
                            Mark {product.isAvailable ? "Unavailable" : "Available"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
