import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types/ecommerce';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, Check, Heart } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, e: React.MouseEvent) => void;
  wishlist?: string[];
  onToggleWishlist?: (productId: string, e: React.MouseEvent) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onSelectProduct,
  onQuickAdd,
  wishlist = [],
  onToggleWishlist,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = activeCategory === 'Tous' || p.category === activeCategory;
        const matchesSearch = 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.materials.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStock = !inStockOnly || p.stock > 0;
        const matchesWishlist = !showWishlistOnly || wishlist.includes(p.id);
        return matchesCategory && matchesSearch && matchesStock && matchesWishlist;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, activeCategory, searchQuery, sortBy, inStockOnly, showWishlistOnly, wishlist]);

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {(['Tous', 'Mobilier', 'Luminaires', 'Céramique', 'Maroquinerie', 'Art de la Table'] as ProductCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search, Sort and Stock Filter */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          
          {/* Instant Search Bar */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Rechercher une pièce, un artisan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
              >
                ×
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-hidden text-xs text-stone-800 font-medium cursor-pointer"
            >
              <option value="featured">Pièces Signature</option>
              <option value="price-asc">Prix : Croissant</option>
              <option value="price-desc">Prix : Décroissant</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>

          {/* In Stock Only Checkbox Button */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              inStockOnly
                ? 'border-stone-900 bg-stone-900 text-white'
                : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
            }`}
          >
            <Check className={`w-3 h-3 ${inStockOnly ? 'opacity-100' : 'opacity-0'}`} />
            <span>En stock</span>
          </button>

          {/* Wishlist filter toggle */}
          {wishlist.length > 0 && (
            <button
              onClick={() => setShowWishlistOnly(!showWishlistOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                showWishlistOnly
                  ? 'border-rose-600 bg-rose-50 text-rose-700 font-semibold'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showWishlistOnly ? 'fill-rose-500 text-rose-500' : 'text-stone-500'}`} />
              <span>Favoris ({wishlist.length})</span>
            </button>
          )}

        </div>

      </div>

      {/* Catalog Grid Header & Result Counter */}
      <div className="flex items-baseline justify-between text-xs text-stone-500 font-mono">
        <span>{filteredProducts.length} {filteredProducts.length > 1 ? 'créations disponibles' : 'création disponible'}</span>
        {activeCategory !== 'Tous' && <span>Filtre actif : {activeCategory}</span>}
      </div>

      {/* Product Cards Grid (Desktop 3 cols, Tablet 2 cols, Mobile 1 col) */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-stone-200 p-8">
          <p className="font-serif font-bold text-lg text-stone-800">Aucune création ne correspond à vos filtres</p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Ajustez vos termes de recherche ou réinitialisez les filtres pour afficher l'ensemble de la collection.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('Tous');
              setInStockOnly(false);
              setShowWishlistOnly(false);
            }}
            className="mt-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickAdd={onQuickAdd}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}

    </section>
  );
};
