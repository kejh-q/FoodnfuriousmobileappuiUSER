import { motion } from "motion/react";
import { Button } from "./ui/button";
import { CheckCircle, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import type { CartItem } from "../hooks/useCart";
import type { CheckoutData } from "./CheckoutPage";

interface OrderCompletePageProps {
  onNavigate: (page: string) => void;
  checkoutData?: CheckoutData;
  clearCafeItems?: (cafe: string) => void;
}

export function OrderCompletePage({ onNavigate, checkoutData, clearCafeItems }: OrderCompletePageProps) {
  const [rating, setRating] = useState(0);
  const [orderSaved, setOrderSaved] = useState(false);
  const { addOrder, currentUser } = useAuth();

  useEffect(() => {
    // Add the order to user's history when this page loads (only once)
    // Wait for currentUser to be loaded before saving order
    if (checkoutData && checkoutData.items.length > 0 && !orderSaved && currentUser) {
      const orderDate = new Date();
      const orderItems = checkoutData.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));
      
      const newOrder = {
        id: `#${Math.floor(1000 + Math.random() * 9000)}`,
        date: orderDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        time: orderDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        status: "Delivered",
        items: orderItems,
        total: checkoutData.total,
        cafe: checkoutData.cafe,
        image: checkoutData.items[0]?.image || "https://images.unsplash.com/photo-1677921755291-c39158477b8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXNpJTIwbGVtYWt8ZW58MXx8fHwxNzYyMjIwNzYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      };
      
      console.log("💾 Saving order:", newOrder);
      addOrder(newOrder);
      console.log("✅ Order saved successfully");
      
      // Clear only the items from this cafe
      if (clearCafeItems && checkoutData.cafe) {
        console.log("🗑️ Clearing items from cafe:", checkoutData.cafe);
        clearCafeItems(checkoutData.cafe);
      }
      
      setOrderSaved(true);
    }
  }, [checkoutData, addOrder, clearCafeItems, orderSaved, currentUser]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 transition-colors duration-300"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-32 h-32 bg-[#FFD60A] dark:bg-yellow-600 rounded-full flex items-center justify-center mb-8 transition-colors duration-300"
      >
        <CheckCircle className="w-16 h-16 text-gray-900 dark:text-white" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-8"
      >
        <h1 className="text-gray-900 dark:text-white mb-2">Order Delivered!</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your food has been delivered successfully
        </p>
      </motion.div>

      {/* Order Details */}
      {checkoutData && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-8 transition-colors duration-300"
        >
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Order Complete</span>
              <span>RM {checkoutData.total.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-700 pt-3">
              <p className="text-gray-900 dark:text-white mb-2">Items:</p>
              {checkoutData.items.map((item, i) => (
                <p key={i} className="text-gray-600 dark:text-gray-400">
                  {item.quantity}x {item.name}
                </p>
              ))}
            </div>
            <div className="border-t border-gray-300 dark:border-gray-700 pt-3">
              <p className="text-gray-900 dark:text-white mb-1">Delivered by Ahmad Zaki</p>
              <p className="text-gray-600 dark:text-gray-400">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Rating */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-md mb-8"
      >
        <p className="text-gray-900 dark:text-white text-center mb-4">Rate your experience</p>
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-10 h-10 ${
                  star <= rating
                    ? "fill-[#FFD60A] dark:fill-yellow-500 text-[#FFD60A] dark:text-yellow-500"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-md space-y-3"
      >
        <Button
          onClick={() => onNavigate("home")}
          className="w-full h-14 bg-[#FFD60A] dark:bg-yellow-600 hover:bg-[#FFC700] dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl transition-colors"
        >
          Order Again
        </Button>
        <Button
          onClick={() => onNavigate("home")}
          variant="outline"
          className="w-full h-14 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 transition-colors"
        >
          Back to Home
        </Button>
      </motion.div>

      {/* Confetti Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 1 }}
            animate={{
              y: window.innerHeight + 100,
              rotate: Math.random() * 360,
              opacity: 0,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 0.5,
              ease: "linear",
            }}
            className="absolute w-3 h-3 bg-[#FFD60A] rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
}
