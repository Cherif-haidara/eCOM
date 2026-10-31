/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, CartItem, Order, ActiveRole, ProductReview } from './types/ecommerce';
import { INITIAL_PRODUCTS } from './data/mockProducts';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { VendorDashboard } from './components/VendorDashboard';
import { ArchitectureHubModal } from './components/ArchitectureHubModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { Footer } from './components/Footer';
import { Check, X } from 'lucide-react';

export default function App() {
  // State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('atelier_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('atelier_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('atelier_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ATL-2026-8942',
        date: '28 Octobre 2026',
        status: 'expedie',
        customer: {
          fullName: 'Sophie Laurent',
          email: 'sophie.laurent@example.com',
          phone: '06 12 34 56 78',
          address: '14 Rue de Turenne',
          city: 'Paris',
          postalCode: '75004',
          country: 'France',
        },
        items: [
          {
            productId: 'prod-chair-01',
            title: 'Fauteuil Lounge Solstice',
            image: '/src/assets/images/product_minimal_chair_1793457104345.jpg',
            finish: 'Noyer Huilé & Bouclette Crème',
            quantity: 1,
            unitPrice: 1850,
            totalPrice: 1850,
          }
        ],
        subtotal: 1850,
        tax: 308.33,
        shipping: 0,
        discount: 0,
        total: 1850,
        paymentMethod: 'card',
        cardLast4: '4242',
        trackingNumber: 'FR-EXP-284910',
        carrier: 'Colissimo Expert Signature',
      }
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('atelier_wishlist');
    return saved ? JSON.parse(saved) : ['prod-lamp-02'];
  });

  const [activeCategory, setActiveCategory] = useState<ProductCategory>('Tous');
  const [activeRole, setActiveRole] = useState<ActiveRole>('client');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('atelier_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('atelier_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('atelier_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('atelier_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Show toast notification
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Pièce retirée de votre sélection de favoris.');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Pièce enregistrée dans vos favoris !');
        return [...prev, productId];
      }
    });
  };

  // Add review to product
  const handleAddReview = (productId: string, newReview: ProductReview) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          const newAvgRating =
            updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
          const updatedProduct = {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: Math.round(newAvgRating * 10) / 10,
          };
          if (selectedProduct && selectedProduct.id === productId) {
            setSelectedProduct(updatedProduct);
          }
          return updatedProduct;
        }
        return p;
      })
    );
    showToast('Votre avis a été certifié et publié.');
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, selectedFinish: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedFinish === selectedFinish
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, quantity, selectedFinish }];
      }
    });
    showToast(`"${product.title}" (${selectedFinish}) a été ajouté au panier.`);
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultFinish = product.finishes[0]?.name || 'Standard';
    handleAddToCart(product, 1, defaultFinish);
  };

  const handleUpdateQuantity = (productId: string, finish: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, finish);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedFinish === finish
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string, finish: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedFinish === finish))
    );
  };

  const handleApplyPromo = (code: string): boolean => {
    if (code === 'ATELIER15') {
      setAppliedPromo('ATELIER15');
      showToast('Code privilège ATELIER15 appliqué (-15%) !');
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    showToast('Code de réduction retiré.');
  };

  const handleOrderComplete = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Deduct stock for ordered items
    setProducts((prev) =>
      prev.map((prod) => {
        const matchingItem = newOrder.items.find((i) => i.productId === prod.id);
        if (matchingItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - matchingItem.quantity),
          };
        }
        return prod;
      })
    );
    // Clear cart
    setCart([]);
    showToast(`Commande ${newOrder.id} validée avec succès !`);
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Nouvelle création "${newProd.title}" mise en ligne avec succès !`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Statut de la commande ${orderId} mis à jour : "${status}".`);
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
    showToast(`Stock mis à jour pour la référence.`);
  };

  // Cart total calculations
  const rawSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = appliedPromo === 'ATELIER15' ? rawSubtotal * 0.15 : 0;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Generate dynamic JSON-LD structured data for the selected product (SEO Schema.org)
  const currentProductJsonLd = selectedProduct
    ? {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: selectedProduct.title,
        image: [selectedProduct.image],
        description: selectedProduct.description,
        sku: selectedProduct.sku,
        mpn: selectedProduct.sku,
        brand: {
          '@type': 'Brand',
          name: selectedProduct.vendor.name,
        },
        offers: {
          '@type': 'Offer',
          url: `https://atelier-co.com/produit/${selectedProduct.slug}`,
          priceCurrency: 'EUR',
          price: selectedProduct.price.toFixed(2),
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability:
            selectedProduct.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'Atelier & Co.',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: selectedProduct.rating.toString(),
          reviewCount: selectedProduct.reviewsCount.toString(),
        },
      }
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:bg-stone-900 selection:text-white">
      
      {/* Promotion / Privilège Announcement Bar */}
      <aside aria-label="Annonce promotionnelle" className="bg-stone-950 text-stone-300 text-[11px] py-2 px-4 border-b border-stone-800 text-center font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span>Édition Automne 2026 : Frais de port offerts dès 300 € d'achat · Code privilège :</span>
          <span className="text-amber-300 font-bold tracking-wider">ATELIER15</span>
          <span>(-15%)</span>
        </div>
      </aside>

      {/* Header conforming to Top Bar Contract */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (activeRole !== 'client') setActiveRole('client');
        }}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeRole={activeRole}
        onChangeRole={setActiveRole}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeRole === 'client' ? (
          <>
            <Hero 
              onExplore={() => {
                const catalogEl = document.getElementById('catalog-section');
                catalogEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenArchitecture={() => setIsArchitectureOpen(true)}
            />

            <ProductCatalog
              products={products}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onSelectProduct={setSelectedProduct}
              onQuickAdd={handleQuickAdd}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
            />
          </>
        ) : (
          <VendorDashboard
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateStock={handleUpdateStock}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (activeRole !== 'client') setActiveRole('client');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
      />

      {/* Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddReview={handleAddReview}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      {/* Complete Checkout Flow Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        subtotal={rawSubtotal}
        discount={discountAmount}
        onOrderComplete={handleOrderComplete}
      />

      {/* Engineering, Scalability, Security & SEO Hub */}
      <ArchitectureHubModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
        currentProductJsonLd={currentProductJsonLd}
      />

      {/* Customer Account & Live Order Tracking Modal */}
      <CustomerAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        orders={orders}
      />

      {/* Notification Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-stone-900 text-white rounded-xl shadow-xl border border-stone-700 text-xs font-medium animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
          <button 
            onClick={() => setToast(null)}
            className="ml-2 text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
