import React, { useState } from 'react';
import { ProductCategory } from '../types/ecommerce';
import { ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenArchitecture: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenArchitecture }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-stone-800">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-serif font-bold text-xl tracking-tight text-white block">
              ATELIER &amp; CO.
            </span>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Maison d'édition et place de marché curatée dédiée aux maîtres d'art, ébénistes, verriers et céramistes contemporains. Chaque création est signée, numérotée et fabriquée dans les règles de l'art.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenArchitecture}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>Console d'Ingénierie &amp; Sécurité Système</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-400">Collections</div>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onSelectCategory('Mobilier')} className="hover:text-white transition-colors cursor-pointer">Mobilier d'Art</button></li>
              <li><button onClick={() => onSelectCategory('Luminaires')} className="hover:text-white transition-colors cursor-pointer">Luminaires Sculpturaux</button></li>
              <li><button onClick={() => onSelectCategory('Céramique')} className="hover:text-white transition-colors cursor-pointer">Grès &amp; Céramique</button></li>
              <li><button onClick={() => onSelectCategory('Maroquinerie')} className="hover:text-white transition-colors cursor-pointer">Maroquinerie Sellier</button></li>
              <li><button onClick={() => onSelectCategory('Art de la Table')} className="hover:text-white transition-colors cursor-pointer">Art de la Table</button></li>
            </ul>
          </div>

          {/* Maison & Ateliers */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-400">La Maison</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#about" className="hover:text-white transition-colors">Charte des Artisans</a></li>
              <li><a href="#traceability" className="hover:text-white transition-colors">Traçabilité &amp; Éco-conception</a></li>
              <li><a href="#delivery" className="hover:text-white transition-colors">Livraison Spécialisée Gant Blanc</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Conciergerie &amp; Commandes Sur-Mesure</a></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-400">Le Carnet d'Atelier</div>
            <p className="text-xs text-stone-400">
              Recevez en avant-première nos séries limitées et invitations exclusives aux ventes privées d'ateliers.
            </p>
            {subscribed ? (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Merci de votre inscription au carnet d'atelier !</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-lg bg-stone-800 border border-stone-700 text-white placeholder-stone-500 focus:outline-hidden focus:border-stone-400"
                />
                {/* Target of CSS Selector 5: Newsletter submit button */}
                <button
                  type="submit"
                  aria-label="S'inscrire à la newsletter de l'atelier"
                  className="px-4 py-2 bg-stone-100 hover:bg-white text-stone-900 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 shrink-0 cursor-pointer shadow-sm hover:shadow active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
                >
                  S'inscrire
                </button>
              </form>
            )}
            <div className="text-[11px] text-stone-500">
              Engagement anti-spam. Désabonnement en 1 clic à tout moment.
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            &copy; 2026 Atelier &amp; Co. SAS · Tous droits réservés · Made with Passion &amp; Architectural Rigor
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#terms" className="hover:text-stone-300 transition-colors">CGV &amp; Rétractation</a>
            <span>·</span>
            <a href="#privacy" className="hover:text-stone-300 transition-colors">Données Personnelles &amp; RGPD</a>
            <span>·</span>
            <a href="#legal" className="hover:text-stone-300 transition-colors">Mentions Légales</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
