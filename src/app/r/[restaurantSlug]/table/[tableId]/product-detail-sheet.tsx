"use client";

import { useState } from "react";
import Image from "next/image";
import { formatRupiah, cn } from "@/lib/utils";
import { X, Minus, Plus } from "lucide-react";

type ProductDetailSheetProps = {
  product: any | null;
  onClose: () => void;
  onAddToCart: (item: any) => void;
};

export default function ProductDetailSheet({
  product,
  onClose,
  onAddToCart,
}: ProductDetailSheetProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");

  if (!product) return null;

  // Calculate total price
  const basePrice = product.price;
  const addonsPrice = product.addons?.reduce(
    (total: number, addon: any) =>
      selectedAddons[addon.id] ? total + addon.price : total,
    0
  ) || 0;
  const unitPrice = basePrice + addonsPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    // Validate variants (simple validation: if variant exists, must select one if we want to enforce it. For POC, we just pass what's selected)
    const cartItem = {
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice,
      totalPrice,
      variants: selectedVariants,
      addons: product.addons?.filter((a: any) => selectedAddons[a.id]) || [],
      notes,
    };
    onAddToCart(cartItem);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background border-t border-surface-border rounded-t-2xl z-50 flex flex-col max-h-[90dvh] shadow-2xl animate-in slide-in-from-bottom-full duration-300">
        
        {/* Header Image & Close */}
        <div className="relative h-64 w-full shrink-0 bg-surface-variant rounded-t-2xl overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-secondary">No Image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-md rounded-full text-foreground hover:bg-background transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 -mt-6 relative z-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">{product.name}</h2>
            {product.description && (
              <p className="text-secondary mt-2 text-sm leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* Variants */}
          {product.variants?.map((variant: any) => {
            let options: string[] = [];
            try {
              options = JSON.parse(variant.options);
            } catch (e) {
              console.error(e);
            }
            return (
              <div key={variant.id} className="space-y-3">
                <h3 className="font-bold text-base">{variant.name}</h3>
                <div className="flex flex-col gap-2">
                  {options.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 p-3 border border-outline/30 rounded-m3-md cursor-pointer hover:bg-surface-variant/20 transition-colors">
                      <input
                        type="radio"
                        name={`variant-${variant.id}`}
                        className="w-5 h-5 text-primary focus:ring-primary accent-primary"
                        checked={selectedVariants[variant.name] === opt}
                        onChange={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: opt }))}
                      />
                      <span className="text-sm font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Add-ons */}
          {product.addons && product.addons.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-base">Add-ons</h3>
              <div className="flex flex-col gap-2">
                {product.addons.map((addon: any) => (
                  <label key={addon.id} className="flex items-center justify-between p-3 border border-outline/30 rounded-m3-md cursor-pointer hover:bg-surface-variant/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-primary rounded-sm focus:ring-primary accent-primary"
                        checked={!!selectedAddons[addon.id]}
                        onChange={(e) => setSelectedAddons(prev => ({ ...prev, [addon.id]: e.target.checked }))}
                      />
                      <span className="text-sm font-medium">{addon.name}</span>
                    </div>
                    <span className="text-sm text-secondary">+{formatRupiah(addon.price)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
            <div className="space-y-3 mt-4">
              <label className="text-sm font-semibold text-foreground">Special Instructions</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g. No spicy, less ice..."
                className="w-full p-3 bg-surface border border-surface-border rounded-lg text-sm outline-none focus:border-primary transition-colors text-foreground"
                rows={3}
              />
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 pb-8 sm:pb-4 bg-background border-t border-surface-border space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-surface border border-surface-border rounded-lg p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded bg-surface text-foreground hover:bg-surface-variant disabled:opacity-30 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold w-6 text-center text-sm text-foreground">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 rounded bg-surface text-foreground hover:bg-surface-variant transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-primary-foreground py-3.5 px-4 rounded-lg font-medium text-sm shadow-sm hover:opacity-90 transition-opacity flex items-center justify-between"
            >
              <span>Add to Cart</span>
              <span>{formatRupiah(totalPrice)}</span>
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
