import React from 'react';
import { ShoppingBag, ShieldCheck, User, Store, Compass } from 'lucide-react';
import { ActiveRole, ProductCategory } from '../types/ecommerce';

interface HeaderProps {
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  cartCount: number;
  onOpenCart: () => void;
  activeRole: ActiveRole;
  onChangeRole: (role: ActiveRole) => void;
  onOpenArchitecture: () => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  cartCount,
  onOpenCart,
  activeRole,
  onChangeRole,
  onOpenArchitecture,
  onOpenAccount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-stone-200/90 transition-all duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant Top Bar Contract: 3 zones separated by gap-8 */}
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Single text element wordmark in display face (Target of CSS Selector 2) */}
          <button 
            onClick={() => onSelectCategory('Tous')}
            className="text-left text-xl sm:text-2xl font-serif font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:opacity-85 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 rounded-md transition-all duration-150 cursor-pointer"
            aria-label="Atelier & Co. - Retour au catalogue principal"
          >
            ATELIER &amp; CO.
          </button>

          {/* Zone 2: 4-5 single-line clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs tracking-wider uppercase font-medium text-stone-600">
            {(['Tous', 'Mobilier', 'Luminaires', 'Céramique', 'Maroquinerie', 'Art de la Table'] as ProductCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-950 pb-1 cursor-pointer ${
                  activeCategory === cat 
                    ? 'text-stone-950 border-b-2 border-stone-900 font-semibold' 
                    : 'border-b-2 border-transparent hover:border-stone-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary action group (Cart + Role Selector + Architecture Console) */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            
            {/* Architecture & Engineering Inspector (Target of CSS Selector 3) */}
            <button
              onClick={onOpenArchitecture}
              title="Ouvrir la console d'architecture, sécurité & SEO"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-stone-900 text-amber-300 hover:bg-stone-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 transition-all whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline font-semibold">Architecture &amp; Sécurité</span>
              <span className="sm:hidden font-sans font-medium">Tech</span>
            </button>

            {/* Role switch segmented control (Target of CSS Selector 1) */}
            <div className="flex items-center bg-stone-200/80 p-1 rounded-lg text-xs font-medium border border-stone-300/40">
              <button
                onClick={() => onChangeRole('client')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  activeRole === 'client' 
                    ? 'bg-white text-stone-900 shadow-xs font-semibold' 
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Boutique</span>
              </button>
              
              {/* Target of CSS Selector 1: Portail Vendeur button */}
              <button
                onClick={() => onChangeRole('vendeur')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  activeRole === 'vendeur' 
                    ? 'bg-white text-stone-900 shadow-xs font-semibold' 
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-stone-500" />
                <span>Portail Vendeur</span>
              </button>
            </div>

            {/* Customer Account Button */}
            <button
              onClick={onOpenAccount}
              className="p-2.5 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-stone-800 transition-colors shrink-0 cursor-pointer"
              title="Mon Compte & Suivi de commandes"
              aria-label="Ouvrir mon compte client et mes commandes"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Shopping Cart Button (Target of CSS Selector 4) */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-lg text-stone-800 hover:bg-stone-200/60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-stone-900 transition-colors shrink-0 cursor-pointer"
              aria-label="Voir le panier d'achats"
            >
              {/* Target of CSS Selector 4: ShoppingBag svg */}
              <ShoppingBag className="w-5 h-5 text-stone-900 transition-transform hover:scale-105" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-stone-900 text-white text-[11px] font-mono font-medium rounded-full flex items-center justify-center tabular-nums shadow-sm animate-scaleIn">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 border-t border-stone-200/60 scrollbar-none text-xs uppercase font-medium">
          {(['Tous', 'Mobilier', 'Luminaires', 'Céramique', 'Maroquinerie', 'Art de la Table'] as ProductCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1 rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-stone-900 text-white' 
                  : 'bg-stone-200/60 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
