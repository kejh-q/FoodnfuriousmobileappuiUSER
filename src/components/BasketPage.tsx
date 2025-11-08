import { motion } from "motion/react";
import { ArrowLeft, Minus, Plus, Trash2, Store, History } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { CartItem } from "../hooks/useCart";
import { useMemo } from "react";

interface BasketPageProps {
  onNavigate: (page: string, data?: any) => void;
  cartItems: CartItem[];
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

export function BasketPage({ 
  onNavigate, 
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart
}: BasketPageProps) {

  // Group items by cafe
  const itemsByCafe = useMemo(() => {
    const grouped: Record<string, CartItem[]> = {};
    cartItems.forEach((item) => {
      if (!grouped[item.cafe]) {
        grouped[item.cafe] = [];
      }
      grouped[item.cafe].push(item);
    });
    return grouped;
  }, [cartItems]);

  const cafes = Object.keys(itemsByCafe);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      {/* Header */}
      <div className="bg-[#FFD60A] dark:bg-yellow-600 shadow-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate("home")} className="text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-gray-900 dark:text-white flex-1">Your Basket</h1>
            <button 
              onClick={() => onNavigate("order-history")}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <History className="w-5 h-5 text-gray-900 dark:text-white" />
              <span className="text-gray-900 dark:text-white text-sm">Orders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Your basket is empty</p>
            <Button
              onClick={() => onNavigate("home")}
              className="bg-[#FFD60A] dark:bg-yellow-600 hover:bg-[#FFC700] dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl h-12 px-8 transition-colors"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cafes.map((cafe, cafeIndex) => {
              const cafeItems = itemsByCafe[cafe];

              return (
                <motion.div
                  key={cafe}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: cafeIndex * 0.05 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 transition-colors duration-300 h-fit"
                >
                  {/* Cafe Header */}
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
                    <Store className="w-5 h-5 text-gray-900 dark:text-white" />
                    <h2 className="text-gray-900 dark:text-white flex-1">{cafe}</h2>
                  </div>

                  {/* Cafe Items */}
                  <div className="space-y-3 mb-4">
                    {cafeItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-3 transition-colors duration-300"
                      >
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-gray-900 dark:text-white mb-1 truncate">{item.name}</h3>
                            {item.notes && (
                              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 italic">
                                Note: {item.notes}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-gray-900 dark:text-white">RM {item.price.toFixed(2)}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                  {item.quantity === 1 ? (
                                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                  ) : (
                                    <Minus className="w-3.5 h-3.5 text-gray-900 dark:text-white" />
                                  )}
                                </button>
                                <span className="text-gray-900 dark:text-white w-5 text-center text-sm">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 rounded-full bg-[#FFD60A] dark:bg-yellow-600 flex items-center justify-center hover:bg-[#FFC700] dark:hover:bg-yellow-700 transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5 text-gray-900 dark:text-white" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Individual Checkout Button */}
                  <Button
                    onClick={() => onNavigate("checkout", { cafe })}
                    className="w-full h-12 bg-[#FFD60A] dark:bg-yellow-600 hover:bg-[#FFC700] dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl transition-colors"
                  >
                    Checkout
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
