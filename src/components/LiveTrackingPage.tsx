import { motion } from "motion/react";
import { Phone, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { CheckoutData } from "./CheckoutPage";

interface LiveTrackingPageProps {
  onNavigate: (page: string) => void;
  checkoutData?: CheckoutData;
}

// Mock driver data - in a real app, this would come from a backend
const mockDriver = {
  name: "Ahmad Zaki",
  rating: 4.9,
  vehicle: "Honda Wave 125",
  phone: "+60123456789",
  plateNumber: "WXY 1234",
  estimatedTime: 8,
};

// Mock vendor contact data - in a real app, this would come from a backend
const vendorContacts: Record<string, { name: string; phone: string }> = {
  "UM Central Café": { name: "Central Café", phone: "+60123456001" },
  "Faculty of Engineering Cafeteria": { name: "Engineering Cafeteria", phone: "+60123456002" },
  "KK12 Food Court": { name: "KK12 Food Court", phone: "+60123456003" },
  "Asia Café": { name: "Asia Café", phone: "+60123456004" },
};

export function LiveTrackingPage({ onNavigate, checkoutData }: LiveTrackingPageProps) {
  const vendor = checkoutData?.cafe ? vendorContacts[checkoutData.cafe] : null;

  const handleCallDriver = () => {
    // Open phone dialer for driver
    window.location.href = `tel:${mockDriver.phone}`;
  };

  const handleMessageDriver = () => {
    // Open SMS app for driver
    window.location.href = `sms:${mockDriver.phone}`;
  };

  const handleCallVendor = () => {
    // Open phone dialer for vendor
    if (vendor) {
      window.location.href = `tel:${vendor.phone}`;
    }
  };

  const handleMessageVendor = () => {
    // Open SMS app for vendor
    if (vendor) {
      window.location.href = `sms:${vendor.phone}`;
    }
  };

  // Generate order summary text
  const getOrderSummary = () => {
    if (!checkoutData || !checkoutData.items) {
      return "Order details unavailable";
    }
    return checkoutData.items
      .map(item => `${item.quantity}x ${item.name}`)
      .join(", ");
  };

  // Generate order ID based on timestamp
  const orderId = checkoutData 
    ? `#${Date.now().toString().slice(-6)}`
    : "#000000";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-300"
    >
      {/* Google Map */}
      <div className="flex-1 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15935.364919425766!2d101.65274!3d3.12179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc49c701efeae7%3A0xf4d98e5b2f1c287d!2sUniversity%20of%20Malaya!5e0!3m2!1sen!2smy!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />

        {/* Restaurant Pin Overlay */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-10 h-10 bg-[#FFD60A] rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-xl">🏪</span>
          </motion.div>
        </div>

        {/* Delivery Person (Animated) Overlay */}
        <motion.div
          initial={{ top: "75%", left: "37.5%" }}
          animate={{ top: "41.6%", left: "62.5%" }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#FFD60A]">
            <span className="text-2xl">🏍️</span>
          </div>
        </motion.div>

        {/* Destination Pin Overlay */}
        <div className="absolute bottom-1/4 left-1/2 translate-x-1/4 -translate-y-1/2 pointer-events-none">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-xl">📍</span>
          </motion.div>
        </div>
      </div>

      {/* Bottom Card */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 shadow-2xl transition-colors duration-300"
      >
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-gray-600 dark:text-gray-400">Arriving in {mockDriver.estimatedTime} minutes</p>
          </div>
          <h2 className="text-gray-900 dark:text-white mb-1">Driver on the way</h2>
          <p className="text-gray-600 dark:text-gray-400">Your order is being delivered</p>
        </div>

        {/* Driver Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 mb-4 flex items-center gap-4 border border-gray-100 dark:border-gray-600">
          <div className="w-14 h-14 bg-[#FFD60A] rounded-full flex items-center justify-center">
            <span className="text-2xl">🏍️</span>
          </div>
          <div className="flex-1">
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Driver</p>
            <h3 className="text-gray-900 dark:text-white mb-1">{mockDriver.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">⭐ {mockDriver.rating} • {mockDriver.vehicle}</p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{mockDriver.plateNumber}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleCallDriver}
              className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 active:scale-95 transition-all"
              aria-label="Call driver"
            >
              <Phone className="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
            <button 
              onClick={handleMessageDriver}
              className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 active:scale-95 transition-all"
              aria-label="Message driver"
            >
              <MessageSquare className="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
          </div>
        </div>

        {/* Vendor Info */}
        {vendor && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 mb-6 flex items-center gap-4 border border-gray-100 dark:border-gray-600">
            <div className="w-14 h-14 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏪</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Vendor</p>
              <h3 className="text-gray-900 dark:text-white mb-1">{vendor.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {checkoutData?.cafe}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleCallVendor}
                className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 active:scale-95 transition-all"
                aria-label="Call vendor"
              >
                <Phone className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
              <button 
                onClick={handleMessageVendor}
                className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 active:scale-95 transition-all"
                aria-label="Message vendor"
              >
                <MessageSquare className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-gray-400">Order {orderId}</p>
            {checkoutData && (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                RM {checkoutData.total.toFixed(2)}
              </p>
            )}
          </div>
          <p className="text-gray-900 dark:text-white">{getOrderSummary()}</p>
          {checkoutData?.cafe && (
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
              from {checkoutData.cafe}
            </p>
          )}
        </div>

        <Button
          onClick={() => onNavigate("complete")}
          className="w-full h-14 bg-[#FFD60A] hover:bg-[#FFC700] text-gray-900 rounded-xl"
        >
          Mark as Received
        </Button>
      </motion.div>
    </motion.div>
  );
}
