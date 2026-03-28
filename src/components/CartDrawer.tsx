import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

import { toast } from 'sonner';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onClearCart: () => void;
  onCheckoutSuccess?: () => void;
}

export function CartDrawer({ isOpen, onClose, items, onRemove, onClearCart, onCheckoutSuccess }: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    toast.promise(
      async () => {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart: items, total }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Checkout failed');
        }
        const data = await response.json();
        onClearCart();
        if (onCheckoutSuccess) onCheckoutSuccess();
        onClose(); // Close only on success
        return data;
      },
      {
        loading: 'Processing your order...',
        success: (data) => `Order ${data.orderId} placed successfully!`,
        error: (err) => err.message || 'Error processing order.',
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-lg font-serif italic">Your Bag ({items.length})</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p>Your bag is empty</p>
                  <button 
                    onClick={onClose}
                    className="text-black underline underline-offset-4 text-sm font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                          <button 
                            onClick={() => onRemove(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Size: {item.selectedSize}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Qty: {item.quantity}</span>
                        <span className="text-sm font-serif italic">₹{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-xl font-serif italic">₹{total}</span>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center">
                  Shipping and taxes calculated at checkout
                </p>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors group"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
