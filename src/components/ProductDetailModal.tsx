import React, { useState } from 'react';
import { Product, ProductReview } from '../types/ecommerce';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Minus, 
  Plus, 
  Check, 
  Award, 
  Layers, 
  Ruler, 
  Box,
  Share2,
  Heart,
  Send,
  MessageSquare
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedFinish: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
  onAddReview?: (productId: string, newReview: ProductReview) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
  onAddReview,
}) => {
  if (!product) return null;

  const [selectedFinish, setSelectedFinish] = useState<string>(product.finishes[0]?.name || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  // New review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [authorName, setAuthorName] = useState('Sophie Laurent');
  const [authorCity, setAuthorCity] = useState('Paris');
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedFinish);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !onAddReview) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author: authorName.trim() || 'Acheteur Vérifié',
      rating: ratingInput,
      date: "Aujourd'hui",
      comment: commentInput.trim(),
      verifiedPurchase: true,
      userCity: authorCity.trim() || 'France',
    };

    onAddReview(product.id, newRev);
    setReviewSubmitted(true);
    setCommentInput('');
    setTimeout(() => {
      setReviewSubmitted(false);
      setShowReviewForm(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {onToggleWishlist && (
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`p-2 rounded-full border shadow-sm transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white/90 hover:bg-stone-100 text-stone-600 border-stone-200'
              }`}
              title={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
              aria-label={isWishlisted ? "Retirer de ma liste d'envies" : "Enregistrer dans ma liste d'envies"}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/90 hover:bg-stone-100 text-stone-700 shadow-sm border border-stone-200 transition-colors cursor-pointer"
            aria-label="Fermer la vue produit"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
            
            {/* Left Column: Gallery & Photography */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={selectedImage}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-1 rounded">
                  SKU: {product.sku}
                </div>
              </div>

              {/* Thumbnail Selector */}
              {product.secondaryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {product.secondaryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImage === img ? 'border-stone-900 shadow-sm' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Vendor & Craftsmanship Spotlight */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-900 text-white font-serif font-bold flex items-center justify-center shrink-0 text-sm">
                  {product.vendor.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-stone-900">{product.vendor.name}</h4>
                    <span className="text-xs text-stone-500 font-mono">{product.vendor.city}</span>
                  </div>
                  <div className="text-xs text-stone-600 mt-0.5">{product.vendor.badge}</div>
                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-2 pt-2 border-t border-stone-200/60 font-mono">
                    <span>★ {product.vendor.rating.toFixed(2)} / 5</span>
                    <span>·</span>
                    <span>{product.vendor.totalSales} pièces créées</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-sans font-medium">Artisan Vérifié Atelier &amp; Co.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contiguous Purchase Module (PDP Standard) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              <div>
                {/* Clean unboxed category & vendor link */}
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                  <span className="uppercase tracking-widest font-semibold">{product.category}</span>
                  <span>·</span>
                  <span>{product.vendor.name}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
                  {product.title}
                </h1>

                <p className="text-sm text-stone-600 mt-1 leading-relaxed">
                  {product.subtitle}
                </p>

                {/* Rating & Reviews counter */}
                <div className="flex items-center gap-2 mt-3 text-xs">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current fill-none'}`} />
                    ))}
                  </div>
                  <span className="font-semibold text-stone-800 font-mono">{product.rating.toFixed(1)}</span>
                  <span className="text-stone-400">·</span>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className="text-stone-600 underline hover:text-stone-900 cursor-pointer"
                  >
                    {product.reviewsCount} avis d'acheteurs vérifiés
                  </button>
                </div>

                {/* Price Display */}
                <div className="mt-5 pb-5 border-b border-stone-200">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold font-mono tabular-nums text-stone-900">
                      {product.price.toLocaleString('fr-FR')} €
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-base font-mono tabular-nums text-stone-400 line-through">
                        {product.compareAtPrice.toLocaleString('fr-FR')} €
                      </span>
                    )}
                    <span className="text-xs text-stone-500">TVA incluse</span>
                  </div>
                  <div className="text-xs text-emerald-700 mt-1.5 flex items-center gap-1.5 font-medium">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{product.leadTime}</span>
                  </div>
                </div>

                {/* Finish / Variant Selector */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-900 uppercase tracking-wide">Finition Sélectionnée :</span>
                    <span className="text-stone-600 font-medium">{selectedFinish}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.finishes.map((finish) => (
                      <button
                        key={finish.name}
                        onClick={() => setSelectedFinish(finish.name)}
                        disabled={!finish.inStock}
                        className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                          selectedFinish === finish.name
                            ? 'border-stone-900 bg-stone-50 text-stone-900 shadow-xs'
                            : finish.inStock
                              ? 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                              : 'border-stone-200 bg-stone-100 text-stone-400 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" 
                          style={{ backgroundColor: finish.colorCode }}
                        />
                        <span className="truncate max-w-[140px]">{finish.name}</span>
                        {!finish.inStock && <span className="text-[10px] text-stone-400">(Épuisé)</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Buy CTA */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="p-2.5 text-stone-600 hover:text-stone-950 disabled:opacity-40 transition-colors cursor-pointer"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-mono font-semibold text-sm tabular-nums text-stone-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                        className="p-2.5 text-stone-600 hover:text-stone-950 disabled:opacity-40 transition-colors cursor-pointer"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Primary Add to Cart Button */}
                    <button
                      onClick={handleAdd}
                      className={`flex-1 py-3.5 px-6 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                        addedAnimation 
                          ? 'bg-emerald-700 text-white' 
                          : 'bg-stone-900 hover:bg-stone-800 text-white'
                      }`}
                    >
                      {addedAnimation ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Ajouté au Panier !</span>
                        </>
                      ) : (
                        <span>Ajouter au Panier · {(product.price * quantity).toLocaleString('fr-FR')} €</span>
                      )}
                    </button>
                  </div>

                  <div className="text-[11px] text-stone-500 flex items-center justify-between px-1">
                    <span>Stock disponible : {product.stock} exemplaires</span>
                    <span className="text-emerald-700 font-medium">Paiement sécurisé Stripe 3D-Secure</span>
                  </div>
                </div>

                {/* Trust and Guarantees */}
                <div className="mt-6 pt-6 border-t border-stone-200 grid grid-cols-2 gap-3 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
                    <span>Garantie 10 ans atelier</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-stone-700 shrink-0" />
                    <span>Retour 30 jours offert</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-stone-700 shrink-0" />
                    <span>Certificat d'authenticité</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-stone-700 shrink-0" />
                    <span>Livraison sur rendez-vous</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Bottom Tabs: Description, Specs, Reviews */}
          <div className="px-6 sm:px-8 pb-8 pt-4 border-t border-stone-200 bg-stone-50/50">
            <div className="flex items-center gap-6 border-b border-stone-200 mb-6 text-xs uppercase tracking-wider font-semibold text-stone-500">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 transition-colors cursor-pointer ${activeTab === 'details' ? 'border-b-2 border-stone-900 text-stone-900' : 'hover:text-stone-800'}`}
              >
                Histoire &amp; Conception
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 transition-colors cursor-pointer ${activeTab === 'specs' ? 'border-b-2 border-stone-900 text-stone-900' : 'hover:text-stone-800'}`}
              >
                Spécifications Techniques
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 transition-colors cursor-pointer ${activeTab === 'reviews' ? 'border-b-2 border-stone-900 text-stone-900' : 'hover:text-stone-800'}`}
              >
                Avis Clients ({product.reviewsCount})
              </button>
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'details' && (
              <div className="space-y-4 max-w-3xl text-sm text-stone-700 leading-relaxed">
                <p>{product.description}</p>
                <div className="pt-2">
                  <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider mb-2">Points clés de confection :</h4>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {product.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-stone-400 mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl text-xs">
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <div className="text-stone-500 font-medium">Dimensions</div>
                  <div className="font-semibold text-stone-900 mt-0.5">{product.dimensions}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <div className="text-stone-500 font-medium">Matériaux principaux</div>
                  <div className="font-semibold text-stone-900 mt-0.5">{product.materials}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <div className="text-stone-500 font-medium">Poids emballé</div>
                  <div className="font-semibold text-stone-900 mt-0.5">{product.weight}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <div className="text-stone-500 font-medium">Référence SKU &amp; Traçabilité</div>
                  <div className="font-mono font-semibold text-stone-900 mt-0.5">{product.sku}</div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-3xl">
                
                {/* Header with Write Review Button */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">Retours d'expérience vérifiés</h4>
                    <p className="text-stone-500 text-xs">Publiés par les collectionneurs et architectes ayant acquis cette pièce.</p>
                  </div>
                  {onAddReview && (
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{showReviewForm ? 'Fermer le formulaire' : 'Rédiger un avis'}</span>
                    </button>
                  )}
                </div>

                {/* Interactive Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="p-4 rounded-xl bg-white border border-stone-300 space-y-3 animate-fadeIn text-xs">
                    <div className="font-semibold text-stone-900">Partagez votre avis sur "{product.title}"</div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-stone-600 font-medium">Votre note :</span>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRatingInput(star)}
                            className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star className={`w-5 h-5 ${star <= ratingInput ? 'fill-current' : 'text-stone-300'}`} />
                          </button>
                        ))}
                      </div>
                      <span className="font-mono font-bold text-stone-800">{ratingInput} / 5</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-600 mb-1">Votre nom ou initiales</label>
                        <input
                          type="text"
                          required
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1">Ville de livraison</label>
                        <input
                          type="text"
                          required
                          value={authorCity}
                          onChange={(e) => setAuthorCity(e.target.value)}
                          className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1">Votre commentaire d'artisanat</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Qualité des finitions, touché de la matière, respect des délais..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-stone-900"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      {reviewSubmitted ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>Avis publié avec succès !</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-400">Vérification automatique de conformité</span>
                      )}

                      <button
                        type="submit"
                        disabled={reviewSubmitted}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold uppercase tracking-wider text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publier mon avis</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-3">
                  {product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-white rounded-xl border border-stone-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-stone-900">{rev.author}</span>
                            <span className="text-stone-400">·</span>
                            <span className="text-stone-500">{rev.userCity}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">Achat vérifié</span>
                            )}
                          </div>
                          <span className="text-stone-400 text-[11px] font-mono">{rev.date}</span>
                        </div>
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'fill-none stroke-current'}`} />
                          ))}
                        </div>
                        <p className="text-stone-700 leading-relaxed font-sans">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-stone-500 text-xs">
                      Aucun avis pour l'instant. Soyez le premier collectionneur à partager votre expérience !
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
