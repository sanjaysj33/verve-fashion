import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../constants';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

export function SearchModal({ isOpen, onClose, onProductClick }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 top-0 bg-white z-[110] shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex items-center gap-4 mb-12">
                <Search className="w-6 h-6 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products, categories, or styles..."
                  className="flex-1 text-2xl font-serif italic focus:outline-none placeholder:text-gray-200"
                />
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-h-[60vh] overflow-y-auto pr-4 no-scrollbar">
                {results.length > 0 ? (
                  results.map(product => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => {
                        onProductClick(product);
                        onClose();
                      }}
                      className="flex gap-4 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="w-20 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 py-1">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">{product.category}</span>
                        <h4 className="text-sm font-medium mb-1">{product.name}</h4>
                        <p className="text-sm font-serif italic text-gray-600">₹{product.price}</p>
                      </div>
                      <div className="flex items-center">
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                      </div>
                    </motion.div>
                  ))
                ) : query.trim().length > 1 ? (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-gray-400 italic font-serif">No results found for "{query}"</p>
                  </div>
                ) : (
                  <div className="col-span-full">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-4">Quick Links</span>
                    <div className="flex flex-wrap gap-2">
                      {['Dresses', 'Luxury', 'Outerwear', 'Essentials'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="px-4 py-2 rounded-full border border-gray-100 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
