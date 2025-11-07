import { motion } from "motion/react";
import { ArrowLeft, MapPin, Clock, MessageSquare, User, DollarSign, Store } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import type { CartItem } from "../hooks/useCart";

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
  onProceed: (checkoutData: CheckoutData) => void;
  cartItems: CartItem[];
  deliveryLocation?: string;
  selectedCafe?: string;
}

export interface CheckoutData {
  deliveryInstructions: string;
  scheduledTime: string;
  contactFree: boolean;
  driverTip: number;
  cafe: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const timeSlots = [
  "ASAP (15-20 min)",
  "30 minutes",
  "1 hour",
  "1.5 hours",
  "2 hours",
];

const tipOptions = [0, 2, 5, 8, 10];

export function CheckoutPage({ 
  onNavigate, 
  onProceed,
  cartItems,
  deliveryLocation = "Faculty of Engineering",
  selectedCafe
}: CheckoutPageProps) {
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [scheduledTime, setScheduledTime] = useState(timeSlots[0]);
  const [contactFree, setContactFree] = useState(false);
  const [driverTip, setDriverTip] = useState(0);

  // Filter items for selected cafe
  const cafeItems = selectedCafe 
    ? cartItems.filter(item => item.cafe === selectedCafe)
    : cartItems;

  const cafe = selectedCafe || (cafeItems.length > 0 ? cafeItems[0].cafe : "");
  const subtotal = cafeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 2.5;
  const total = subtotal + deliveryFee + driverTip;

  const handleProceed = () => {
    onProceed({
      deliveryInstructions,
      scheduledTime,
      contactFree,
      driverTip,
      cafe,
      items: cafeItems,
      subtotal,
      deliveryFee,
      total,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white dark:bg-gray-900 pb-32 transition-colors duration-300"
    >
      {/* Header */}
      <div className="bg-[#FFD60A] dark:bg-yellow-600 px-6 pt-12 pb-6 transition-colors duration-300">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => onNavigate("basket")} className="text-gray-900 dark:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-gray-900 dark:text-white">Checkout</h1>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Cafe Info */}
        {cafe && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-[#FFF9E6] dark:bg-yellow-900/30 border-2 border-[#FFD60A] dark:border-yellow-600 rounded-2xl p-4 flex items-center gap-3 transition-colors duration-300"
          >
            <Store className="w-6 h-6 text-gray-900 dark:text-white" />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Ordering from</p>
              <p className="text-gray-900 dark:text-white">{cafe}</p>
            </div>
          </motion.div>
        )}

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 transition-colors duration-300"
        >
          <h3 className="text-gray-900 dark:text-white mb-3">Order Items</h3>
          <div className="space-y-2">
            {cafeItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white text-sm">{item.name}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">Qty: {item.quantity}</p>
                </div>
                <span className="text-gray-900 dark:text-white text-sm">
                  RM {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Delivery Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 transition-colors duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#FFD60A] dark:bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300">
              <MapPin className="w-5 h-5 text-gray-900 dark:text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white mb-1">Delivery Location</p>
              <p className="text-gray-600 dark:text-gray-400">{deliveryLocation}</p>
              <button
                onClick={() => onNavigate("location")}
                className="text-[#FFD60A] dark:text-yellow-500 text-sm mt-1 hover:underline"
              >
                Change location
              </button>
            </div>
          </div>
        </motion.div>

        {/* Scheduled Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-900 dark:text-white" />
            <Label className="text-gray-900 dark:text-white">Delivery Time</Label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setScheduledTime(slot)}
                className={`p-3 rounded-xl border-2 transition-all text-sm ${
                  scheduledTime === slot
                    ? "border-[#FFD60A] dark:border-yellow-600 bg-[#FFF9E6] dark:bg-yellow-900/30 text-gray-900 dark:text-white"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Delivery Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-900 dark:text-white" />
            <Label htmlFor="instructions" className="text-gray-900 dark:text-white">
              Delivery Instructions (Optional)
            </Label>
          </div>
          <Textarea
            id="instructions"
            placeholder="E.g., Leave at the door, Call when arriving, etc."
            value={deliveryInstructions}
            onChange={(e) => setDeliveryInstructions(e.target.value)}
            className="min-h-[100px] border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl resize-none transition-colors duration-300"
          />
        </motion.div>

        {/* Contact-free Delivery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 transition-colors duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300">
                <User className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white">Contact-free Delivery</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Driver will leave food at your door
                </p>
              </div>
            </div>
            <Switch
              checked={contactFree}
              onCheckedChange={setContactFree}
              className="data-[state=checked]:bg-[#FFD60A] dark:data-[state=checked]:bg-yellow-600"
            />
          </div>
        </motion.div>

        {/* Driver Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-900 dark:text-white" />
            <Label className="text-gray-900 dark:text-white">Tip for Driver (Optional)</Label>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {tipOptions.map((tip) => (
              <button
                key={tip}
                onClick={() => setDriverTip(tip)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  driverTip === tip
                    ? "border-[#FFD60A] dark:border-yellow-600 bg-[#FFF9E6] dark:bg-yellow-900/30 text-gray-900 dark:text-white"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {tip === 0 ? "No" : `RM ${tip}`}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Price Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-3 transition-colors duration-300"
        >
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Subtotal</span>
            <span>RM {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Delivery Fee</span>
            <span>RM {deliveryFee.toFixed(2)}</span>
          </div>
          {driverTip > 0 && (
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Driver Tip</span>
              <span>RM {driverTip.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-300 dark:border-gray-700 pt-3 flex justify-between text-gray-900 dark:text-white">
            <span>Total</span>
            <span>RM {total.toFixed(2)}</span>
          </div>
        </motion.div>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-gray-100 dark:border-gray-800 p-6 max-w-[430px] mx-auto transition-colors duration-300">
        <Button
          onClick={handleProceed}
          className="w-full h-14 bg-[#FFD60A] dark:bg-yellow-600 hover:bg-[#FFC700] dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl transition-colors"
        >
          Place Order
        </Button>
      </div>
    </motion.div>
  );
}
