import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User as UserIcon, Heart, ShoppingBag, Settings, LogOut, ChevronRight, Package, CreditCard, Bell } from 'lucide-react';
import { User, Product } from '../types';
import { cn } from '../lib/utils';

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
  products: Product[];
  onViewProduct: (product: Product) => void;
  onUpdatePreferences: (preferences: Partial<User['preferences']>) => void;
}

export function AccountDrawer({ isOpen, onClose, user, onLogout, products, onViewProduct, onUpdatePreferences }: AccountDrawerProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'wishlist' | 'orders' | 'settings'>('profile');

  if (!user) return null;

  const wishlistProducts = products.filter(p => user.wishlist.includes(p.id));

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-serif italic">My Account</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-gray-100">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex-1 py-4 flex flex-col items-center gap-1 transition-colors",
                    activeTab === tab.id ? "text-black border-b-2 border-black" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif italic">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="mt-2 inline-block px-3 py-1 bg-amber-50 text-amber-700 text-[10px] uppercase tracking-widest font-bold rounded-full">
                        {user.tier} Member
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Member Since</span>
                      <p className="text-sm font-medium">{user.memberSince}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Total Orders</span>
                      <p className="text-sm font-medium">{user.orders.length}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium">Payment Methods</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium">Notifications</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="space-y-4">
                  {wishlistProducts.length === 0 ? (
                    <div className="text-center py-20">
                      <Heart className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                      <p className="text-gray-400 text-sm italic font-serif">Your wishlist is empty</p>
                    </div>
                  ) : (
                    wishlistProducts.map(product => (
                      <div 
                        key={product.id}
                        onClick={() => onViewProduct(product)}
                        className="flex gap-4 p-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        <div className="w-20 h-24 bg-gray-100 rounded-xl overflow-hidden">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 py-1">
                          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">{product.category}</span>
                          <h4 className="text-sm font-medium mb-1">{product.name}</h4>
                          <p className="text-sm font-serif italic text-gray-600">₹{product.price}</p>
                        </div>
                        <div className="flex items-center pr-2">
                          <ChevronRight className="w-4 h-4 text-gray-300" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {user.orders.length === 0 ? (
                    <div className="text-center py-20">
                      <Package className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                      <p className="text-gray-400 text-sm italic font-serif">No orders yet</p>
                    </div>
                  ) : (
                    user.orders.map(order => (
                      <div key={order.id} className="p-4 border border-gray-100 rounded-2xl space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Order ID</span>
                            <p className="text-sm font-medium">{order.id}</p>
                          </div>
                          <div className="px-3 py-1 bg-green-50 text-green-700 text-[10px] uppercase tracking-widest font-bold rounded-full">
                            {order.status}
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Date</span>
                            <p className="text-xs text-gray-600">{order.date}</p>
                          </div>
                          <p className="text-lg font-serif italic">₹{order.total}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-4">Preferences</span>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-medium">Newsletter Subscription</span>
                        <input 
                          type="checkbox" 
                          checked={user.preferences.newsletter}
                          onChange={(e) => onUpdatePreferences({ newsletter: e.target.checked })}
                          className="w-5 h-5 accent-black"
                        />
                      </label>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-sm font-medium">Currency</span>
                        <select 
                          value={user.preferences.currency}
                          onChange={(e) => onUpdatePreferences({ currency: e.target.value as any })}
                          className="bg-transparent text-sm font-serif italic focus:outline-none cursor-pointer"
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-sm font-medium">Theme</span>
                        <select 
                          value={user.preferences.theme}
                          onChange={(e) => onUpdatePreferences({ theme: e.target.value as any })}
                          className="bg-transparent text-sm uppercase tracking-widest font-bold text-xs focus:outline-none cursor-pointer"
                        >
                          <option value="light">LIGHT</option>
                          <option value="dark">DARK</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100">
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
