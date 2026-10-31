import React from 'react';
import { ArrowUpRight, ShieldCheck, Truck, Sparkles, Award } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onOpenArchitecture: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOpenArchitecture }) => {
  return (
    <section className="relative overflow-hidden border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {/* Two-Column Editorial Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs uppercase tracking-widest text-stone-500 font-medium">
              Plateforme Haute Facture · Édition Automne 2026
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-[1.12]" style={{ textWrap: 'balance' }}>
              L'artisanat d'exception sublimé par l'architecture moderne.
            </h1>

            <p className="text-base text-stone-600 leading-relaxed max-w-xl">
              Une sélection rigoureuse de mobilier sculpté, luminaires cinématiques et pièces de vie façonnées à la main par les plus éminents maîtres d'art français et européens.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExplore}
                className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-2 group whitespace-nowrap shrink-0"
              >
                <span>Explorer les Pièces</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={onOpenArchitecture}
                className="px-5 py-3.5 bg-transparent hover:bg-stone-200/50 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-lg border border-stone-300 transition-colors whitespace-nowrap shrink-0"
              >
                Architecture &amp; Sécurité
              </button>
            </div>

            {/* Trust Markers without pill boxes */}
            <div className="pt-6 border-t border-stone-200/70 grid grid-cols-3 gap-4 text-stone-600">
              <div>
                <div className="text-base font-serif font-bold text-stone-900">100%</div>
                <div className="text-xs text-stone-500 mt-0.5">Ateliers Certifiés</div>
              </div>
              <div>
                <div className="text-base font-serif font-bold text-stone-900">10 Ans</div>
                <div className="text-xs text-stone-500 mt-0.5">Garantie Structure</div>
              </div>
              <div>
                <div className="text-base font-serif font-bold text-stone-900">&lt; 72h</div>
                <div className="text-xs text-stone-500 mt-0.5">Livraison Spécialisée</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/11] shadow-xl border border-stone-200/80 bg-stone-100 group">
              <img
                src="/src/assets/images/hero_modern_interior_1793457104279.jpg"
                alt="Intérieur architectural meublé avec la collection contemporaine Atelier & Co."
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              
              {/* Subtle caption overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent text-white flex items-center justify-between text-xs">
                <div>
                  <div className="font-serif font-semibold text-sm">Espace Villa Vence</div>
                  <div className="text-stone-300 text-[11px]">Fauteuil Solstice &amp; Table Monolithe en Travertin</div>
                </div>
                <div className="font-mono text-stone-300 text-[11px] tabular-nums">
                  Pièces sur-mesure
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
