import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onShopClick: () => void;
  onAccountClick: () => void;
  onSearchClick: () => void;
}

export function Navbar({ cartCount, onCartClick, onShopClick, onAccountClick, onSearchClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAction = async (name: string) => {
    try {
      if (name === 'Search') {
        onSearchClick();
      } else if (name === 'Account') {
        onAccountClick();
      } else if (name === 'Collections') {
        const res = await fetch('/api/collections');
        const data = await res.json();
        toast.info(`Collections API: ${data.collections.join(', ')}`);
      } else if (name === 'Shop') {
        onShopClick();
      } else if (name === 'About') {
        toast.info('Elite Aura Fashion Store is a minimalist fashion brand focusing on longevity and style.');
      } else {
        toast.info(`${name} feature coming soon`);
      }
    } catch (error) {
      toast.error(`Error connecting to ${name} API`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest font-medium text-gray-500">
              <a href="#" onClick={(e) => { e.preventDefault(); handleAction('Shop'); }} className="hover:text-black transition-colors">Shop</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleAction('Collections'); }} className="hover:text-black transition-colors">Collections</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleAction('About'); }} className="hover:text-black transition-colors">About</a>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-2xl font-serif italic tracking-tighter font-bold cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Elite Aura</h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleAction('Search')}
              className="p-2 text-gray-500 hover:text-black transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleAction('Account')}
              className="p-2 text-gray-500 hover:text-black transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={onCartClick}
              className="p-2 text-gray-500 hover:text-black transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="p-4 space-y-4 text-xs uppercase tracking-widest font-bold text-gray-500">
              <a href="#" onClick={(e) => { e.preventDefault(); handleAction('Shop'); setIsMenuOpen(false); }} className="block hover:text-black">Shop</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleAction('Collections'); setIsMenuOpen(false); }} className="block hover:text-black">Collections</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleAction('About'); setIsMenuOpen(false); }} className="block hover:text-black">About</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
