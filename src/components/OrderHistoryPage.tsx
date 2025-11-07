import { motion } from "motion/react";
import { ArrowLeft, Package, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification";
import type { CartItem } from "../hooks/useCart";

interface OrderHistoryPageProps {
  onNavigate: (page: string) => void;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
}

export function OrderHistoryPage({ onNavigate, addToCart }: OrderHistoryPageProps) {
  const { getUserOrders } = useAuth();
  const { showNotification } = useNotification();
  const orderHistory = getUserOrders();

  const handleReorder = (order: any) => {
    // Add all items from the order to cart
    order.items.forEach((item: any) => {
      addToCart({
        id: `reorder-${order.id}-${item.name}`,
        name: item.name,
        price: item.price,
        image: item.image,
        cafe: order.cafe,
      }, item.quantity);
    });
    
    showNotification("success", `${order.items.length} item(s) added to cart!`);
    onNavigate("basket");
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white dark:bg-gray-900 pb-20 transition-colors duration-300"
    >
      {/* Header */}
      <div className="bg-[#FFD60A] dark:bg-yellow-600 px-6 pt-12 pb-6 transition-colors duration-300">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => onNavigate("profile")} className="text-gray-900 dark:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-gray-900 dark:text-white">Order History</h1>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-6 mt-6">
        <div className="space-y-4">
          {orderHistory.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300"
            >
              <div className="p-4">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={order.image}
                      alt={order.cafe}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-gray-900 dark:text-white">{order.cafe}</h3>
                        <p className="text-gray-600 dark:text-gray-400">Order {order.id}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          order.status === "Delivered"
                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {order.date} • {order.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-gray-600 dark:text-gray-400">
                      {item.quantity}x {item.name}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-900 dark:text-white">RM {order.total.toFixed(2)}</span>
                  {order.status === "Delivered" && (
                    <button 
                      onClick={() => handleReorder(order)}
                      className="text-[#FFD60A] dark:text-yellow-500 hover:text-[#FFC700] dark:hover:text-yellow-600 transition-colors"
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {orderHistory.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No orders yet</p>
            <p className="text-gray-500 dark:text-gray-500">Your order history will appear here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
