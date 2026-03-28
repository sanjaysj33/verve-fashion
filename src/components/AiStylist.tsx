import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, X, Loader2 } from 'lucide-react';
import { getStylistAdvice } from '../services/geminiService';
import { Product } from '../types';
import { cn } from '../lib/utils';

interface AiStylistProps {
  cart: Product[];
}

export function AiStylist({ cart }: AiStylistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const advice = await getStylistAdvice(userMsg, cart);
      setMessages(prev => [...prev, { role: 'ai', content: advice || "I'm sorry, I couldn't process that request." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to the stylist. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 border border-white/20"
      >
        <Sparkles className="w-5 h-5 text-amber-400" />
        <span className="font-medium text-sm">AI Stylist</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-8 z-50 w-96 max-w-[calc(100vw-4rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[500px]"
          >
            <div className="bg-black p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-white font-serif italic">Personal Stylist</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">Ask me for styling tips or outfit recommendations!</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "ml-auto bg-black text-white rounded-br-none" 
                      : "mr-auto bg-white border border-gray-100 shadow-sm rounded-bl-none text-gray-800"
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-400 text-xs italic">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Stylist is thinking...
                </div>
              )}
            </div>

            <div className="p-4 border-top border-gray-100 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="What should I wear with a silk dress?"
                  className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-black hover:text-amber-600 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
