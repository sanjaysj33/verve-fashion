/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { AiStylist } from './components/AiStylist';
import { ProductDetail } from './components/ProductDetail';
import { AuthModal } from './components/AuthModal';
import { AccountDrawer } from './components/AccountDrawer';
import { SearchModal } from './components/SearchModal';
import { PRODUCTS } from './constants';
import { Product, CartItem, User } from './types';
import { motion } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const collectionRef = useRef<HTMLElement>(null);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/account');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setWishlist(data.user.wishlist || []);
      }
    } catch (error) {
      console.error('Auth check failed');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const refreshUser = async () => {
    await checkAuth();
  };

  const syncWishlist = async (newWishlist: string[]) => {
    if (!user) return;
    try {
      await fetch('/api/account/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishlist: newWishlist })
      });
    } catch (error) {
      console.error('Wishlist sync failed');
    }
  };

  const updatePreferences = async (newPrefs: Partial<User['preferences']>) => {
    if (!user) return;
    try {
      const res = await fetch('/api/account/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrefs)
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        toast.success('Preferences updated');
      }
    } catch (error) {
      toast.error('Failed to update preferences');
    }
  };

  const scrollToCollection = () => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const isAdded = prev.includes(id);
      const next = isAdded ? prev.filter(item => item !== id) : [...prev, id];
      
      if (isAdded) {
        toast.info('Removed from wishlist');
      } else {
        toast.success('Added to wishlist');
      }
      
      syncWishlist(next);
      return next;
    });
  };

  const categories = ['All', ...new Set(PRODUCTS.map(p => p.category))];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        toast.success(`Increased quantity of ${product.name}`);
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success(`Added ${product.name} to bag`);
      return [...prev, { ...product, quantity: 1, selectedSize: product.sizes[0], selectedColor: product.colors[0] }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.info('Item removed from bag');
  };

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white">
      <Toaster position="top-center" expand={false} richColors />
      
      <Navbar 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)} 
        onShopClick={scrollToCollection}
        onAccountClick={() => user ? setIsAccountOpen(true) : setIsAuthOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      <main>
        <Hero onShopClick={scrollToCollection} />

        <section ref={collectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div>
              <h2 className="text-4xl font-serif italic mb-4">The Collection</h2>
              <p className="text-gray-500 max-w-md">
                Explore our curated selection of seasonal pieces designed for longevity and style.
              </p>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all border ${
                    activeCategory === cat 
                      ? 'bg-black text-white border-black' 
                      : 'bg-transparent text-gray-400 border-gray-200 hover:border-black hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
                onViewDetails={(p) => setSelectedProduct(p)}
                isWishlisted={wishlist.includes(product.id)}
                onWishlistToggle={() => toggleWishlist(product.id)}
              />
            ))}
          </div>
        </section>

        <section className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl font-serif italic mb-6">Join the Verve Circle</h2>
              <p className="text-gray-500 mb-10">
                Subscribe to receive early access to new collections, styling tips, and exclusive events.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={async (e) => {
                e.preventDefault();
                const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                try {
                  const response = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                  });
                  if (response.ok) {
                    toast.success('Thank you for joining our circle!');
                  } else {
                    toast.error('Failed to subscribe. Please try again.');
                  }
                } catch (error) {
                  toast.error('Error connecting to server.');
                }
              }}>
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="Enter your email" 
                  className="flex-1 px-6 py-4 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black transition-all"
                />
                <button type="submit" className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-900 transition-colors">
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <h1 className="text-xl font-serif italic font-bold cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Verve</h1>
            <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
              <a href="#" onClick={async (e) => { 
                e.preventDefault(); 
                const res = await fetch('/api/health');
                const data = await res.json();
                toast.info(`Privacy Policy (Server Status: ${data.status})`); 
              }} className="hover:text-black transition-colors">Privacy</a>
              <a href="#" onClick={async (e) => { 
                e.preventDefault(); 
                const res = await fetch('/api/health');
                toast.info('Terms of Service (Verified by Backend)'); 
              }} className="hover:text-black transition-colors">Terms</a>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Shipping Info coming soon'); }} className="hover:text-black transition-colors">Shipping</a>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Returns Policy coming soon'); }} className="hover:text-black transition-colors">Returns</a>
            </div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              © 2026 Verve Fashion. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onRemove={removeFromCart}
        onClearCart={() => setCart([])}
        onCheckoutSuccess={refreshUser}
      />

      <ProductDetail 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onWishlistToggle={() => selectedProduct && toggleWishlist(selectedProduct.id)}
      />

      <AiStylist cart={cart} />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={(u) => {
          setUser(u);
          setWishlist(u.wishlist || []);
        }}
      />

      <AccountDrawer 
        isOpen={isAccountOpen} 
        onClose={() => setIsAccountOpen(false)} 
        user={user}
        products={PRODUCTS}
        onViewProduct={(p) => {
          setSelectedProduct(p);
          setIsAccountOpen(false);
        }}
        onUpdatePreferences={updatePreferences}
        onLogout={async () => {
          await fetch('/api/account/logout', { method: 'POST' });
          setUser(null);
          setWishlist([]);
          setIsAccountOpen(false);
          toast.info('Signed out successfully');
        }}
      />

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onProductClick={(p) => setSelectedProduct(p)}
      />
    </div>
  );
}
