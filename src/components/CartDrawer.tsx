import React, { useState } from 'react';
import { CartItem } from '../types/ecommerce';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, finish: string, quantity: number) => void;
  onRemoveItem: (productId: string, finish: string) => void;
  onCheckout: () => void;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountRate = appliedPromo === 'ATELIER15' ? 0.15 : 0;
  const discountAmount = rawSubtotal * discountRate;
  const subtotalAfterDiscount = rawSubtotal - discountAmount;
  
  // Free delivery threshold: 300€
  const freeShippingThreshold = 300;
  const shippingCost = rawSubtotal >= freeShippingThreshold || rawSubtotal === 0 ? 0 : 35;
  const total = subtotalAfterDiscount + shippingCost;
  const shippingProgress = Math.min(100, (rawSubtotal / freeShippingThreshold) * 100);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoInput.trim()) return;
    const ok = onApplyPromo(promoInput.trim().toUpperCase());
    if (ok) {
      setPromoInput('');
    } else {
      setPromoError('Code non valide. Essayez le code privilège : ATELIER15');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-md h-full bg-white flex flex-col shadow-2xl border-l border-stone-200 animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">Votre Panier</h2>
            <p className="text-xs text-stone-500 font-mono">
              {items.reduce((acc, i) => acc + i.quantity, 0)} {items.length > 1 ? 'articles' : 'article'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 text-xs">
          {rawSubtotal >= freeShippingThreshold ? (
            <div className="text-emerald-700 font-medium flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Livraison offerte appliquée à votre commande !</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between text-stone-600">
                <span>Plus que <strong className="font-mono text-stone-900 tabular-nums">{(freeShippingThreshold - rawSubtotal).toLocaleString('fr-FR')} €</strong> pour la livraison offerte</span>
                <span className="font-mono tabular-nums">{Math.round(shippingProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-stone-900 transition-all duration-300" 
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-stone-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <X className="w-8 h-8 opacity-40" />
              </div>
              <div>
                <p className="font-serif font-semibold text-stone-800 text-lg">Votre panier est vide</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Découvrez notre collection de pièces artisanales et meublez votre espace avec authenticité.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors"
              >
                Explorer la Collection
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedFinish}-${idx}`} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-semibold text-stone-900 leading-tight">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.selectedFinish)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Retirer du panier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">{item.selectedFinish}</div>
                    <div className="text-[11px] text-stone-400 font-mono">{item.product.vendor.name}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedFinish, item.quantity - 1)}
                        className="p-1 text-stone-600 hover:text-stone-900 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-mono font-medium text-xs tabular-nums text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedFinish, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 text-stone-600 hover:text-stone-900 disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-semibold font-mono text-sm tabular-nums text-stone-900">
                      {(item.product.price * item.quantity).toLocaleString('fr-FR')} €
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
            
            {/* Promo code form */}
            {appliedPromo ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                <div className="flex items-center gap-1.5 font-mono">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Code <strong>{appliedPromo}</strong> (-15%) appliqué</span>
                </div>
                <button
                  onClick={onRemovePromo}
                  className="text-stone-500 hover:text-stone-800 text-[11px] underline"
                >
                  Retirer
                </button>
              </div>
            ) : (
              <form onSubmit={handlePromoSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code privilège (ex: ATELIER15)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
                >
                  Appliquer
                </button>
              </form>
            )}
            {promoError && (
              <div className="text-[11px] text-rose-600 font-sans">{promoError}</div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200/80">
              <div className="flex justify-between">
                <span>Sous-total articles</span>
                <span className="font-mono tabular-nums text-stone-900">{rawSubtotal.toLocaleString('fr-FR')} €</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Remise privilège (15%)</span>
                  <span className="font-mono tabular-nums">- {discountAmount.toLocaleString('fr-FR')} €</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Frais d'expédition &amp; assurance</span>
                <span className="font-mono tabular-nums">
                  {shippingCost === 0 ? <strong className="text-emerald-700 font-normal">Offerts</strong> : `${shippingCost} €`}
                </span>
              </div>
              <div className="flex justify-between text-stone-400 text-[11px]">
                <span>Dont TVA estimée (20%)</span>
                <span className="font-mono tabular-nums">{((subtotalAfterDiscount * 0.2) / 1.2).toFixed(2)} €</span>
              </div>

              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total TTC</span>
                <span className="font-mono tabular-nums">{total.toLocaleString('fr-FR')} €</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={onCheckout}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 group"
            >
              <span>Passer la Commande Sécurisée</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Paiement crypté SSL 256-bit · 3D-Secure v2</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
