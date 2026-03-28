import React from 'react';
import { motion } from 'motion/react';
import { Plus, Heart } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails, isWishlisted, onWishlistToggle }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={() => onViewDetails(product)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-2xl mb-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle();
          }}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <Heart className={cn("w-4 h-4 transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-900")} />
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-4 left-4 right-4 bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 translate-y-12 group-hover:translate-y-0 transition-transform duration-300"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add to Cart</span>
        </button>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 block">
            {product.category}
          </span>
          <h3 className="text-sm font-medium text-gray-900 group-hover:underline underline-offset-4">
            {product.name}
          </h3>
        </div>
        <span className="text-sm font-serif italic text-gray-600">
          ₹{product.price}
        </span>
      </div>
    </motion.div>
  );
}
