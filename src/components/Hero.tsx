import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
}

export function Hero({ onShopClick }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
          alt="Fashion Hero" 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="text-amber-400 text-xs uppercase tracking-[0.3em] font-bold mb-4 block">
            Spring / Summer 2026
          </span>
          <h2 className="text-6xl md:text-8xl font-serif italic text-white leading-tight mb-8">
            The Art of <br />
            <span className="not-italic font-sans font-light">Understated</span>
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-lg leading-relaxed">
            Curated essentials for the modern minimalist. Discover our new collection of ethically sourced luxury pieces.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onShopClick}
              className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center gap-2 group"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="border border-white/30 text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-colors"
            >
              Our Story
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 right-12 hidden lg:block">
        <div className="flex items-center gap-4 text-white/40 text-xs tracking-widest uppercase vertical-rl rotate-180">
          <span>Scroll to explore</span>
          <div className="w-px h-12 bg-white/20" />
        </div>
      </div>
    </section>
  );
}
