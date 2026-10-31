import React from 'react';
import { Product } from '../types/ecommerce';
import { Plus, Star, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product, e: React.MouseEvent) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  return (
    <div
      onClick={() => onSelect(product)}
      className="group cursor-pointer flex flex-col bg-white rounded-xl border border-stone-200/90 overflow-hidden hover:shadow-lg hover:border-stone-300 transition-all duration-300 transform-gpu"
    >
      {/* Product Image Showcase */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Quiet status tag (Zero pill box - clean editorial corner text) */}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-xs text-white text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm">
            Nouveauté
          </div>
        )}

        {/* Wishlist Heart Button */}
        {onToggleWishlist && (
          <button
            onClick={(e) => onToggleWishlist(product.id, e)}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-all duration-200 shadow-sm cursor-pointer ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-white/80 hover:bg-white text-stone-600 border border-stone-200/60'
            }`}
            title={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
            aria-label={`Ajouter ${product.title} à la liste d'envies`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        )}

        {/* Quick Add Button overlay */}
        <button
          onClick={(e) => onQuickAdd(product, e)}
          className="absolute bottom-3 right-3 p-2.5 rounded-lg bg-stone-900/90 hover:bg-stone-950 text-white backdrop-blur-xs opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 shadow-md cursor-pointer"
          title="Ajout rapide au panier"
          aria-label={`Ajouter ${product.title} au panier`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Unboxed clean metadata with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
            <span className="uppercase tracking-wider font-medium text-[11px]">{product.category}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="truncate">{product.vendor.name}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-base font-semibold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1">
            {product.title}
          </h3>

          {/* Subtitle / material hint */}
          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing and stock info */}
        <div className="flex items-baseline justify-between pt-2 border-t border-stone-100">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold font-mono tabular-nums text-stone-900">
              {product.price.toLocaleString('fr-FR')} €
            </span>
            {product.compareAtPrice && (
              <span className="text-xs font-mono tabular-nums text-stone-400 line-through">
                {product.compareAtPrice.toLocaleString('fr-FR')} €
              </span>
            )}
          </div>

          {/* Stock or Rating indicator */}
          <div className="flex items-center gap-1 text-xs text-stone-600 font-mono">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-stone-800">{product.rating.toFixed(1)}</span>
            <span className="text-stone-400 text-[11px]">({product.reviewsCount})</span>
          </div>
        </div>

      </div>
    </div>
  );
};
