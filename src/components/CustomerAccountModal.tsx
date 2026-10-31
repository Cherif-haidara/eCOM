import React, { useState } from 'react';
import { Order } from '../types/ecommerce';
import { 
  X, 
  Package, 
  MapPin, 
  User, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onOpenOrderInvoice?: (order: Order) => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'tracking' | 'profile'>('orders');
  const [searchTracking, setSearchTracking] = useState('');
  const [trackingResult, setTrackingResult] = useState<Order | null>(null);
  const [trackingError, setTrackingError] = useState(false);

  if (!isOpen) return null;

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError(false);
    const found = orders.find(
      (o) =>
        o.trackingNumber.toLowerCase() === searchTracking.trim().toLowerCase() ||
        o.id.toLowerCase() === searchTracking.trim().toLowerCase()
    );
    if (found) {
      setTrackingResult(found);
    } else {
      setTrackingResult(null);
      setTrackingError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-stone-900 text-white font-serif font-bold text-sm flex items-center justify-center">
              SL
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Espace Client · Sophie Laurent</h3>
              <p className="text-xs text-stone-500 font-mono">sophie.laurent@example.com · Membre Privilège</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-6 px-6 border-b border-stone-200 bg-white text-xs font-semibold uppercase tracking-wider text-stone-500">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 transition-colors ${activeTab === 'orders' ? 'border-b-2 border-stone-900 text-stone-900' : 'hover:text-stone-800'}`}
          >
            Mes Commandes ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`py-3 transition-colors ${activeTab === 'tracking' ? 'border-b-2 border-stone-900 text-stone-900' : 'hover:text-stone-800'}`}
          >
            Suivi Colis en Direct
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 transition-colors ${activeTab === 'profile' ? 'border-b-2 border-stone-900 text-stone-900' : 'hover:text-stone-800'}`}
          >
            Adresses &amp; Conciergerie
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* TAB 1: ORDERS LIST */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-stone-500 space-y-2">
                  <Package className="w-10 h-10 mx-auto text-stone-300" />
                  <p className="font-semibold text-stone-800 text-sm">Vous n'avez pas encore passé de commande</p>
                  <p className="text-stone-500 text-xs">
                    Vos achats réalisés sur la boutique apparaîtront ici avec factures et suivi d'atelier.
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-stone-200/80">
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-stone-900 text-sm">{order.id}</strong>
                        <span className="text-stone-300">·</span>
                        <span className="text-stone-500 font-mono">{order.date}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                        order.status === 'livre' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'expedie' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        Statut : {order.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.title} className="w-9 h-9 rounded object-cover border border-stone-200" />
                            <div>
                              <div className="font-semibold text-stone-900">{item.title}</div>
                              <div className="text-stone-500 text-[11px]">{item.finish} × {item.quantity}</div>
                            </div>
                          </div>
                          <span className="font-mono font-medium tabular-nums">{item.totalPrice.toLocaleString('fr-FR')} €</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-stone-600">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Truck className="w-3.5 h-3.5 text-stone-400" />
                        <span>Suivi : {order.trackingNumber} ({order.carrier})</span>
                      </div>
                      <div className="font-bold text-stone-900 font-mono">
                        Total réglé : {order.total.toLocaleString('fr-FR')} € TTC
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: LIVE TRACKING */}
          {activeTab === 'tracking' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-stone-900 text-sm mb-1">Recherche de Colis &amp; Acheminement</h4>
                <p className="text-stone-500 text-xs">Entrez votre référence de commande ou numéro de suivi pour géolocaliser l'expédition.</p>
              </div>

              <form onSubmit={handleTrackSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="ex: FR-EXP-284910 ou ATL-2026-1042"
                  value={searchTracking}
                  onChange={(e) => setSearchTracking(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 font-mono text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold uppercase tracking-wider text-xs transition-colors shrink-0"
                >
                  Rechercher
                </button>
              </form>

              {trackingError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  Aucune expédition trouvée pour cette référence. Vérifiez le format (ex: FR-EXP-XXXXXX).
                </div>
              )}

              {(trackingResult || orders[0]) && (
                <div className="p-5 rounded-xl border border-stone-200 bg-stone-50 space-y-4">
                  {(() => {
                    const target = trackingResult || orders[0];
                    return (
                      <>
                        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                          <div>
                            <span className="font-semibold text-stone-900 text-sm block">Commande {target.id}</span>
                            <span className="font-mono text-stone-500 text-[11px]">{target.carrier} · Réf: {target.trackingNumber}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-mono uppercase font-semibold text-[11px]">
                            En cours d'acheminement
                          </span>
                        </div>

                        {/* Chronological steps */}
                        <div className="space-y-4 relative pl-6 border-l-2 border-stone-300 ml-2">
                          <div className="relative">
                            <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-white"></span>
                            <div className="font-semibold text-stone-900">En cours de livraison finale</div>
                            <div className="text-stone-500 text-[11px]">Aujourd'hui · Prise en charge par l'équipe de livraison locale</div>
                          </div>
                          <div className="relative">
                            <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-white"></span>
                            <div className="font-semibold text-stone-900">Arrivé sur la plateforme logistique régionale Paris Île-de-France</div>
                            <div className="text-stone-500 text-[11px]">Hier, 22h40 · Contrôle d'intégrité des emballages certifié</div>
                          </div>
                          <div className="relative">
                            <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-white"></span>
                            <div className="font-semibold text-stone-900">Expédié depuis l'Atelier Maître</div>
                            <div className="text-stone-500 text-[11px]">Départ atelier · Certificat d'authenticité scellé dans le colis</div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED ADDRESSES & PREFERENCES */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900">Adresse de Facturation &amp; Livraison Principale</span>
                  <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono">Par défaut</span>
                </div>
                <div className="text-stone-600 leading-relaxed font-sans">
                  Sophie Laurent<br />
                  14 Rue de Turenne<br />
                  75004 Paris, France<br />
                  Tél : +33 6 12 34 56 78
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                <div className="font-semibold text-stone-900">Service Conciergerie Dédié</div>
                <p className="text-stone-500 text-xs">
                  En tant que cliente Atelier &amp; Co., vous disposez d'un conseiller personnel pour organiser des visites d'ateliers partenaires ou coordonner des commandes volumineuses avec vos architectes.
                </p>
                <div className="text-stone-700 font-mono pt-1 text-[11px]">
                  Ligne directe conciergerie : <strong className="text-stone-950">+33 1 42 68 00 00</strong> (Lun-Ven 9h-19h)
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-stone-200 bg-stone-50">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold uppercase tracking-wider text-xs transition-colors"
          >
            Fermer mon espace
          </button>
        </div>

      </div>
    </div>
  );
};
