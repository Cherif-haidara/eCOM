import React, { useState } from 'react';
import { CartItem, Order } from '../types/ecommerce';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Printer,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  onOrderComplete: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  onOrderComplete,
}) => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  
  // Shipping Form State
  const [formData, setFormData] = useState({
    fullName: 'Sophie Laurent',
    email: 'sophie.laurent@example.com',
    phone: '06 12 34 56 78',
    address: '14 Rue de Turenne',
    city: 'Paris',
    postalCode: '75004',
    country: 'France',
    deliveryMethod: 'standard', // 'standard' (0€) | 'express' (18€) | 'white_glove' (45€)
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'alma_3x'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('892');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const shippingCost = formData.deliveryMethod === 'express' ? 18 : formData.deliveryMethod === 'white_glove' ? 45 : (subtotal >= 300 ? 0 : 35);
  const total = subtotal - discount + shippingCost;
  const tax = ((subtotal - discount) * 0.2) / 1.2;

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('892');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: `ATL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'payé',
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        items: items.map(item => ({
          productId: item.product.id,
          title: item.product.title,
          image: item.product.image,
          finish: item.selectedFinish,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity,
        })),
        subtotal,
        tax,
        shipping: shippingCost,
        discount,
        total,
        paymentMethod: paymentMethod === 'apple_pay' ? 'apple_pay' : paymentMethod === 'alma_3x' ? 'alma_3x' : 'card',
        cardLast4: '4242',
        trackingNumber: `FR-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
        carrier: formData.deliveryMethod === 'white_glove' ? 'Transport Privé Spécialisé' : 'Colissimo Expert Signature',
      };

      setCompletedOrder(newOrder);
      onOrderComplete(newOrder);
      setIsProcessing(false);
      setStep('confirmation');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-stone-900 text-lg">ATELIER &amp; CO.</span>
            <span className="text-stone-300">|</span>
            <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
              {step === 'shipping' && 'Étape 1 : Coordonnées & Livraison'}
              {step === 'payment' && 'Étape 2 : Règlement Sécurisé'}
              {step === 'confirmation' && 'Commande Confirmée'}
            </span>
          </div>
          {step !== 'confirmation' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {/* STEP 1: SHIPPING & ADDRESS */}
          {step === 'shipping' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-stone-900 mb-1">Adresse de livraison &amp; contact</h3>
                <p className="text-xs text-stone-500">Toutes les pièces volumineuses sont livrées avec assurance intégrale.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Nom et prénom complet</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Adresse email (pour la confirmation)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 text-stone-900"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-medium mb-1">Adresse postale</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Code Postal</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Ville</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Téléphone mobile (SMS livreur)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Pays de livraison</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-hidden focus:border-stone-900 text-stone-900 bg-white"
                  >
                    <option value="France">France métropolitaine</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Luxembourg">Luxembourg</option>
                  </select>
                </div>
              </div>

              {/* Delivery Service Selection */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  Mode d'acheminement
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'standard' })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.deliveryMethod === 'standard' 
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900' 
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-stone-900">
                      <span>Standard Colissimo</span>
                      <span className="font-mono">{subtotal >= 300 ? 'Gratuit' : '35 €'}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">Livraison sous 3 à 5 jours ouvrés à domicile.</p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'express' })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.deliveryMethod === 'express' 
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900' 
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-stone-900">
                      <span>Express 24h</span>
                      <span className="font-mono">+18 €</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">Livraison garantie le lendemain avant 13h.</p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'white_glove' })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.deliveryMethod === 'white_glove' 
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900' 
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-stone-900">
                      <span>Gants Blancs</span>
                      <span className="font-mono">+45 €</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">2 livreurs, déballage dans la pièce et reprise emballages.</p>
                  </div>
                </div>
              </div>

              {/* Order total recap bar */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div className="text-xs text-stone-600">
                  Total panier : <strong className="font-mono text-stone-900">{total.toLocaleString('fr-FR')} € TTC</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 group"
                >
                  <span>Continuer vers le Paiement</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SECURE PAYMENT (STRIPE SIMULATOR) */}
          {step === 'payment' && (
            <form onSubmit={handleProcessPayment} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-stone-900">Moyen de règlement sécurisé</h3>
                  <p className="text-xs text-stone-500">Chiffrement AES-256 avec authentification 3D-Secure.</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Protocole TLS 1.3</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-stone-800" />
                  <span className="font-medium text-stone-900">Carte Bancaire</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                    paymentMethod === 'apple_pay' 
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-stone-800" />
                  <span className="font-medium text-stone-900">Apple / Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('alma_3x')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                    paymentMethod === 'alma_3x' 
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="font-bold text-sm text-stone-900">3×</span>
                  <span className="font-medium text-stone-900">Alma Sans Frais</span>
                </button>
              </div>

              {/* Credit Card Form (Stripe Elements look & feel) */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-800">Détails de la Carte</span>
                    <button
                      type="button"
                      onClick={handleFillTestCard}
                      className="text-[11px] font-mono text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 transition-colors"
                    >
                      Remplir carte de test 4242
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Numéro de carte</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white font-mono text-xs tracking-wider text-stone-900 focus:outline-hidden focus:border-stone-900"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">Date d'expiration (MM/AA)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white font-mono text-xs tracking-wider text-stone-900 focus:outline-hidden focus:border-stone-900"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">Cryptogramme visuel (CVC)</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          maxLength={4}
                          className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white font-mono text-xs tracking-wider text-stone-900 focus:outline-hidden focus:border-stone-900"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'alma_3x' && (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                  <div className="font-semibold text-stone-900">Échéancier de paiement en 3 fois sans frais :</div>
                  <div className="space-y-1 font-mono text-stone-700">
                    <div className="flex justify-between">
                      <span>1ère mensualité (aujourd'hui) :</span>
                      <strong>{(total / 3).toFixed(2)} €</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>2ème mensualité (dans 30 jours) :</span>
                      <span>{(total / 3).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>3ème mensualité (dans 60 jours) :</span>
                      <span>{(total / 3).toFixed(2)} €</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-500 pt-1 border-t border-stone-200">
                    Validation instantanée par carte bancaire. Aucun justificatif requis.
                  </p>
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="p-6 rounded-xl bg-black text-white text-center space-y-2">
                  <div className="font-semibold text-sm">Payer avec Touch ID ou Face ID</div>
                  <p className="text-xs text-stone-400">Le débit sera de {total.toLocaleString('fr-FR')} € sur votre carte Apple Pay par défaut.</p>
                </div>
              )}

              {/* Order total confirmation */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour aux coordonnées</span>
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Traitement bancaire 3D Secure...</span>
                    </span>
                  ) : (
                    <span>Confirmer et Payer · {total.toLocaleString('fr-FR')} €</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ORDER CONFIRMATION & INVOICE RECEIPT */}
          {step === 'confirmation' && completedOrder && (
            <div className="space-y-6 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    Merci pour votre commande, {completedOrder.customer.fullName} !
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Le paiement a été validé avec succès. Un email récapitulatif a été transmis à <strong className="font-mono">{completedOrder.customer.email}</strong>.
                  </p>
                </div>
              </div>

              {/* Order reference and tracking info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 text-[11px] block">Numéro de Commande</span>
                  <span className="text-stone-900 font-bold text-sm">{completedOrder.id}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 text-[11px] block">Numéro de Suivi Colis</span>
                  <span className="text-stone-900 font-bold text-sm">{completedOrder.trackingNumber}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 text-[11px] block">Transporteur Sélectionné</span>
                  <span className="text-stone-900 font-bold text-sm">{completedOrder.carrier}</span>
                </div>
              </div>

              {/* Tracking timeline */}
              <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
                <div className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  Suivi de Préparation en Direct
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-emerald-500 rounded-full"></div>
                    <span className="font-medium text-emerald-700">1. Payé</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-emerald-500 rounded-full"></div>
                    <span className="font-medium text-emerald-700">2. En Atelier</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-stone-200 rounded-full"></div>
                    <span className="text-stone-400">3. Expédié</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-stone-200 rounded-full"></div>
                    <span className="text-stone-400">4. Livré</span>
                  </div>
                </div>
              </div>

              {/* Itemized summary */}
              <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-stone-50 px-4 py-2.5 font-semibold text-stone-700 border-b border-stone-200">
                  Articles commandés ({completedOrder.items.length})
                </div>
                <div className="divide-y divide-stone-100 p-4 space-y-3">
                  {completedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 pt-2 first:pt-0">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover border border-stone-200" />
                        <div>
                          <div className="font-semibold text-stone-900">{item.title}</div>
                          <div className="text-stone-500 text-[11px]">{item.finish} × {item.quantity}</div>
                        </div>
                      </div>
                      <span className="font-mono font-semibold tabular-nums text-stone-900">
                        {item.totalPrice.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                  ))}
                </div>
                <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-between font-bold text-sm">
                  <span>Total Réglé TTC</span>
                  <span className="font-mono tabular-nums">{completedOrder.total.toLocaleString('fr-FR')} €</span>
                </div>
              </div>

              {/* Actions: Print and Close */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer le reçu de commande</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
                >
                  Retourner à la Boutique
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
