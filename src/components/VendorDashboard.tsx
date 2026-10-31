import React, { useState } from 'react';
import { Product, Order, ProductCategory } from '../types/ecommerce';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Plus, 
  CheckCircle, 
  Clock, 
  Truck, 
  X,
  AlertCircle
} from 'lucide-react';

interface VendorDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateOrderStatus,
  onUpdateStock,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'payouts'>('inventory');

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('Mobilier');
  const [newPrice, setNewPrice] = useState<number>(1200);
  const [newStock, setNewStock] = useState<number>(5);
  const [newDescription, setNewDescription] = useState('');
  const [newMaterials, setNewMaterials] = useState('');
  const [newDimensions, setNewDimensions] = useState('');

  // Calculate Vendor Metrics (for 'Atelier de L’Odon' as primary vendor demo)
  const vendorProducts = products.filter(p => p.vendor.id === 'v1');
  const totalGrossSales = 68450;
  const marketplaceCommission = totalGrossSales * 0.12;
  const netEarnings = totalGrossSales - marketplaceCommission;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Product = {
      id: `prod-custom-${Date.now()}`,
      title: newTitle,
      subtitle: newMaterials || 'Création artisanale sur-mesure',
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      category: newCategory,
      price: Number(newPrice),
      stock: Number(newStock),
      vendor: {
        id: 'v1',
        name: 'Atelier de L’Odon',
        city: 'Bayeux, Normandie',
        rating: 4.95,
        totalSales: 419,
        badge: 'Maître Ébéniste Certifié',
        verified: true,
      },
      description: newDescription || 'Pièce unique façonnée artisanalement selon les règles de l’art.',
      details: ['Fabrication 100% atelier', 'Finitions manuelles haut de gamme'],
      dimensions: newDimensions || 'Dimensions personnalisées',
      materials: newMaterials || 'Matériaux nobles sélectionnés',
      weight: '8.0 kg',
      finishes: [
        { name: 'Finition Signature Atelier', colorCode: '#452a1d', inStock: true },
      ],
      image: '/src/assets/images/product_minimal_chair_1793457104345.jpg',
      secondaryImages: ['/src/assets/images/product_minimal_chair_1793457104345.jpg'],
      rating: 5.0,
      reviewsCount: 1,
      isNew: true,
      leadTime: 'Fabriqué à la commande sous 10 jours',
      sku: `ATL-NEW-${Math.floor(100 + Math.random() * 900)}`,
      reviews: [],
    };

    onAddProduct(created);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Top Banner / Vendor Profile Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 rounded-2xl bg-white border border-stone-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-stone-900 text-white font-serif font-bold text-xl flex items-center justify-center shrink-0">
            AO
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold text-stone-900">Atelier de L’Odon</h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                Partenaire Certifié
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">Bayeux, Normandie · Ébénisterie d'Art &amp; Mobilier Sculptural</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Création</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-stone-200">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Chiffre d'Affaires Brut</span>
            <DollarSign className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-2 tabular-nums">
            {totalGrossSales.toLocaleString('fr-FR')} €
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% ce mois</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-stone-200">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Reversement Net Artisan</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-2 tabular-nums">
            {netEarnings.toLocaleString('fr-FR')} €
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            88% après commission (12%)
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-stone-200">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Pièces au Catalogue</span>
            <Package className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-2 tabular-nums">
            {vendorProducts.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Toutes en ligne &amp; actives
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-stone-200">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Satisfaction Acheteurs</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-2 tabular-nums">
            4.95 / 5
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Basé sur 418 avis vérifiés
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-stone-200 text-xs font-semibold uppercase tracking-wider text-stone-500">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 transition-colors ${activeTab === 'inventory' ? 'border-b-2 border-stone-900 text-stone-900' : 'hover:text-stone-800'}`}
        >
          Gestion de l'Inventaire ({vendorProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors ${activeTab === 'orders' ? 'border-b-2 border-stone-900 text-stone-900' : 'hover:text-stone-800'}`}
        >
          Commandes Reçues ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`pb-3 transition-colors ${activeTab === 'payouts' ? 'border-b-2 border-stone-900 text-stone-900' : 'hover:text-stone-800'}`}
        >
          Virements &amp; Commissions Stripe
        </button>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700">Vos pièces en vente sur Atelier &amp; Co.</span>
            <span className="text-xs text-stone-500 font-mono">Synchronisation instantanée avec le stock</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/70 text-stone-600 uppercase text-[11px] font-mono border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Pièce &amp; Référence</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4">Prix Public</th>
                  <th className="py-3 px-4">Stock Actuel</th>
                  <th className="py-3 px-4">Délai d'Expédition</th>
                  <th className="py-3 px-4 text-right">Ajuster Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {vendorProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover border border-stone-200" />
                      <div>
                        <div className="font-semibold text-stone-900">{p.title}</div>
                        <div className="text-[11px] font-mono text-stone-400">{p.sku}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">{p.category}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold tabular-nums text-stone-900">
                      {p.price.toLocaleString('fr-FR')} €
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-mono tabular-nums font-semibold px-2 py-0.5 rounded text-[11px] ${
                        p.stock > 2 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {p.stock} unités
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 text-[11px]">{p.leadTime}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 bg-stone-100 p-1 rounded-md">
                        <button
                          onClick={() => onUpdateStock(p.id, Math.max(0, p.stock - 1))}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white text-stone-700 hover:bg-stone-200 transition-colors font-bold"
                          title="Diminuer stock"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono font-medium">{p.stock}</span>
                        <button
                          onClick={() => onUpdateStock(p.id, p.stock + 1)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white text-stone-700 hover:bg-stone-200 transition-colors font-bold"
                          title="Augmenter stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm space-y-4">
          <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700">Expéditions et commandes à traiter</span>
            <span className="text-xs text-stone-500 font-mono">Mise à jour en temps réel des acheteurs</span>
          </div>

          <div className="p-4 divide-y divide-stone-100">
            {orders.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-xs">
                Aucune commande en attente. Dès qu'un client passe commande, elle apparaîtra ici avec l'étiquette transporteur.
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="font-mono text-sm text-stone-900">{order.id}</strong>
                      <span className="text-stone-400">·</span>
                      <span className="text-xs text-stone-500">{order.date}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        order.status === 'livre' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'expedie' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="text-xs text-stone-700 mt-1">
                      Destinataire : <strong>{order.customer.fullName}</strong> ({order.customer.city}, {order.customer.postalCode})
                    </div>

                    <div className="text-xs text-stone-500 mt-0.5">
                      {order.items.map(i => `${i.title} (${i.finish}) × ${i.quantity}`).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-stone-900 mr-2 tabular-nums">
                      {order.total.toLocaleString('fr-FR')} €
                    </span>

                    {order.status === 'payé' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'en_preparation')}
                        className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium transition-colors"
                      >
                        Mettre en préparation
                      </button>
                    )}

                    {order.status === 'en_preparation' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'expedie')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Marquer Expédié</span>
                      </button>
                    )}

                    {order.status === 'expedie' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'livre')}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-medium transition-colors"
                      >
                        Confirmer Livraison
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PAYOUTS */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm text-xs">
          <h3 className="text-sm font-semibold text-stone-900">Échéancier des Virements Bancaires SEPA</h3>
          <p className="text-stone-500">
            Conformément aux accords de distribution de la marketplace, vos gains nets (88%) sont virés automatiquement sur votre compte professionnel chaque mardi via Stripe Connect.
          </p>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 font-mono">
            <div className="flex justify-between">
              <span>Prochain virement programmé :</span>
              <strong className="text-emerald-700">Mardi prochain (3 240,00 €)</strong>
            </div>
            <div className="flex justify-between">
              <span>Compte bénéficiaire :</span>
              <span>FR76 3000 •••• •••• •••• •• 89 (BNP Paribas)</span>
            </div>
            <div className="flex justify-between">
              <span>Taux de commission appliqué :</span>
              <span>12.00% HT (Service marketplace, assurance casse &amp; conciergerie)</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-200 max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-base text-stone-900">Ajouter une Pièce au Catalogue</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Nom de la création</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Console Murale en Chêne Sablé"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Catégorie</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 text-stone-900 bg-white"
                  >
                    <option value="Mobilier">Mobilier</option>
                    <option value="Luminaires">Luminaires</option>
                    <option value="Céramique">Céramique</option>
                    <option value="Maroquinerie">Maroquinerie</option>
                    <option value="Art de la Table">Art de la Table</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Prix (€ TTC)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Stock initial</label>
                  <input
                    type="number"
                    min={1}
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 text-stone-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Matériaux principaux</label>
                  <input
                    type="text"
                    placeholder="ex: Chêne massif & acier patiné"
                    value={newMaterials}
                    onChange={(e) => setNewMaterials(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Dimensions</label>
                <input
                  type="text"
                  placeholder="ex: L 110 × P 35 × H 85 cm"
                  value={newDimensions}
                  onChange={(e) => setNewDimensions(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Description éditoriale</label>
                <textarea
                  rows={3}
                  placeholder="Racontez la genèse de l’œuvre, le travail de la matière et les finitions..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 text-stone-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold uppercase tracking-wider text-xs"
                >
                  Publier l'Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
