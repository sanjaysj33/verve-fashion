import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Heart, Share2 } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
}

export function ProductDetail({ product, onClose, onAddToCart, isWishlisted, onWishlistToggle }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
    }
  }, [product]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl bg-white z-[90] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-amber-600 font-bold mb-2 block">
                  {product.category}
                </span>
                <h2 className="text-4xl font-serif italic mb-4">{product.name}</h2>
                <p className="text-2xl font-serif italic text-gray-500 mb-6">₹{product.price}</p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {product.description}
                </p>
              </div>

              <div className="space-y-6 mb-10">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 block">Select Color</span>
                  <div className="flex gap-3">
                    {product.colors.map(color => (
                      <button 
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-full border p-0.5 transition-all",
                          selectedColor === color ? "border-black scale-110" : "border-gray-200 hover:scale-110"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 block">Select Size</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-4 py-2 border rounded-lg text-xs font-medium transition-colors",
                          selectedSize === size ? "bg-black text-white border-black" : "border-gray-200 hover:border-black"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="flex-1 bg-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Bag
                </button>
                <button 
                  onClick={onWishlistToggle}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Heart className={cn("w-5 h-5 transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-900")} />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
