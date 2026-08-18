"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatRupiah, cn } from "@/lib/utils";
import ProductDetailSheet from "./product-detail-sheet";
import { useCartStore } from "@/lib/store";
import { ShoppingCart, ReceiptText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { getCustomerSessionId } from "@/lib/session";

type ClientMenuProps = {
  categories: any[]; // Using any for POC brevity, could be strictly typed with Prisma generated types
};

export default function ClientMenu({ categories }: ClientMenuProps) {
  const params = useParams();
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const addItem = useCartStore(state => state.addItem);
  const cartItems = useCartStore(state => state.items);
  const cartTotal = useCartStore(state => state.getCartTotal());
  const [mounted, setMounted] = useState(false);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    setMounted(true);
    setSessionId(getCustomerSessionId());
  }, []);

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    products: cat.products.filter((p: any) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  })).filter(cat => cat.products.length > 0);

  return (
    <div className="flex flex-col h-full absolute inset-0">
      {/* Search Bar */}
      <div className="p-6 pb-4 flex-none bg-background">
        <input
          type="text"
          placeholder="Search menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface border border-surface-border text-foreground rounded-lg px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-secondary"
        />
      </div>

      {/* Category Chips - Minimalist Editorial */}
      <div className="flex-none bg-background/95 backdrop-blur-md py-3 px-6 flex gap-2 overflow-x-auto no-scrollbar border-b border-surface-border">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              document.getElementById(`category-${cat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-surface text-secondary border-surface-border hover:bg-surface-variant hover:text-foreground"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-background pb-32 relative z-0">
        {filteredCategories.length === 0 ? (
          <div className="text-center text-outline py-12">
            No menu items found.
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div key={cat.id} id={`category-${cat.id}`} className="space-y-4 pt-4">
              <h2 className="text-lg font-bold tracking-tight text-foreground mb-3">
                {cat.name}
              </h2>
              <div className="space-y-3">
                {cat.products.map((product: any) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-surface p-4 flex gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group border border-surface-border rounded-lg"
                  >
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-sm leading-tight text-foreground group-hover:text-accent transition-colors">{product.name}</h3>
                        {product.description && (
                          <p className="text-xs text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 font-semibold text-sm text-foreground">
                        {formatRupiah(product.price)}
                      </div>
                    </div>
                    {product.imageUrl && (
                      <div className="relative w-24 h-24 shrink-0 rounded-md overflow-hidden bg-surface-variant border border-surface-border">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={cat.id === activeCategory}
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <ProductDetailSheet 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(item) => {
          addItem(item);
          setSelectedProduct(null);
        }}
      />

      {/* Floating Action Buttons */}
      {mounted && (
        <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-3 items-end">
          {sessionId && (
            <Link href={`/r/${params.restaurantSlug}/table/${params.tableId}/bill`}>
              <div className="bg-surface text-foreground rounded-full shadow-md p-3.5 flex items-center justify-center hover:scale-105 active:scale-95 transition-all border border-surface-border">
                <ReceiptText className="w-5 h-5 text-secondary" />
              </div>
            </Link>
          )}
          
          {cartItems.length > 0 && (
            <Link href={`/r/${params.restaurantSlug}/table/${params.tableId}/cart`}>
              <div className="bg-primary text-primary-foreground rounded-full shadow-lg p-4 flex items-center justify-center hover:scale-105 active:scale-95 transition-all relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
