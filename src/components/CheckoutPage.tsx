import { motion } from "motion/react";
import { ArrowLeft, MapPin, MessageSquare, User, DollarSign, Store, Tag, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../hooks/useAuth";
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
  contactFree: boolean;
  driverTip: number;
  cafe: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  promoCode?: string;
  discount?: number;
}

interface PromoCode {
  code: string;
  description: string;
  discount: string;
  minSpend?: number;
  isActive: boolean;
}

const tipOptions = [0, 2, 5, 8, 10];

export function CheckoutPage({ 
  onNavigate, 
  onProceed,
  cartItems,
  deliveryLocation = "Faculty of Engineering",
  selectedCafe
}: CheckoutPageProps) {
  const { currentUser } = useAuth();
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [contactFree, setContactFree] = useState(false);
  const [driverTip, setDriverTip] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Available promo codes
  const availablePromoCodes: PromoCode[] = [
    {
      code: "WELCOME20",
      description: "Welcome bonus for new users",
      discount: "20% OFF",
      minSpend: 15,
      isActive: true,
    },
    {
      code: "UMSTUDENT",
      description: "Special discount for UM students",
      discount: "RM 5 OFF",
      minSpend: 20,
      isActive: true,
    },
    {
      code: "FREESHIP",
      description: "Free delivery on all orders",
      discount: "FREE DELIVERY",
      isActive: true,
    },
  ];

  // Filter items for selected cafe
  const cafeItems = selectedCafe 
    ? cartItems.filter(item => item.cafe === selectedCafe)
    : cartItems;

  const cafe = selectedCafe || (cafeItems.length > 0 ? cafeItems[0].cafe : "");
  const subtotal = cafeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const baseDeliveryFee = 2.5;
  
  // Calculate promo discount
  let discount = 0;
  let deliveryFee = baseDeliveryFee;
  
  if (appliedPromo) {
    if (appliedPromo.discount.includes("%")) {
      // Percentage discount
      const percentage = parseInt(appliedPromo.discount.replace(/[^0-9]/g, ""));
      discount = (subtotal * percentage) / 100;
    } else if (appliedPromo.discount.includes("RM")) {
      // Fixed amount discount
      discount = parseFloat(appliedPromo.discount.replace(/[^0-9.]/g, ""));
    } else if (appliedPromo.discount.includes("FREE DELIVERY")) {
      // Free delivery
      deliveryFee = 0;
      discount = baseDeliveryFee;
    }
  }
  
  const total = Math.max(0, subtotal + deliveryFee + driverTip - (appliedPromo?.discount.includes("FREE DELIVERY") ? 0 : discount));

  const handleSelectPromo = (promo: PromoCode) => {
    // Check if user is verified
    if (!currentUser?.isVerified && currentUser?.userType !== "Guest") {
      toast.error("Please verify your email to use promo codes");
      return;
    }

    if (currentUser?.userType === "Guest") {
      toast.error("Promo codes are not available for guest users");
      return;
    }

    // Check minimum spend requirement
    if (promo.minSpend && subtotal < promo.minSpend) {
      toast.error(`Minimum spend of RM ${promo.minSpend} required for this promo code`);
      return;
    }

    setAppliedPromo(promo);
    toast.success(`Promo code ${promo.code} applied! ${promo.discount}`);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    toast.success("Promo code removed");
  };

  const handleProceed = () => {
    onProceed({
      deliveryInstructions,
      contactFree,
      driverTip,
      cafe,
      items: cafeItems,
      subtotal,
      deliveryFee,
      total,
      promoCode: appliedPromo?.code,
      discount,
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
                  {item.notes && (
                    <p className="text-gray-500 dark:text-gray-400 text-xs italic mt-0.5">
                      Note: {item.notes}
                    </p>
                  )}
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

        {/* Delivery Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
          transition={{ delay: 0.3 }}
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
          transition={{ delay: 0.4 }}
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

        {/* Promo Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-gray-900 dark:text-white" />
            <Label className="text-gray-900 dark:text-white">Promo Code</Label>
          </div>
          
          {currentUser?.isVerified ? (
            <>
              {!appliedPromo ? (
                <div className="space-y-2">
                  {availablePromoCodes.map((promo) => {
                    const canUse = !promo.minSpend || subtotal >= promo.minSpend;
                    return (
                      <button
                        key={promo.code}
                        onClick={() => canUse && handleSelectPromo(promo)}
                        disabled={!canUse}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          canUse
                            ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#FFD60A] dark:hover:border-yellow-600 hover:bg-[#FFF9E6] dark:hover:bg-yellow-900/20"
                            : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-[#FFD60A] dark:text-yellow-500" />
                            <span className="text-gray-900 dark:text-white">{promo.code}</span>
                          </div>
                          <span className="text-gray-900 dark:text-white">{promo.discount}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{promo.description}</p>
                        {promo.minSpend && (
                          <p className={`text-xs mt-1 ${canUse ? "text-gray-500 dark:text-gray-500" : "text-red-500 dark:text-red-400"}`}>
                            {canUse ? `Min. spend: RM ${promo.minSpend}` : `Need RM ${(promo.minSpend - subtotal).toFixed(2)} more to use`}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Tag className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white">{appliedPromo.code}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{appliedPromo.discount}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-orange-50 dark:bg-orange-950 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-4 text-center">
              <p className="text-gray-900 dark:text-white mb-1">Promo codes unavailable</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {currentUser?.userType === "Guest" 
                  ? "Guest users cannot use promo codes" 
                  : "Verify your email to use promo codes"}
              </p>
              {currentUser?.userType !== "Guest" && (
                <Button
                  onClick={() => onNavigate("profile")}
                  className="bg-[#FFD60A] hover:bg-[#FFC700] dark:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl h-10"
                >
                  Verify Email
                </Button>
              )}
            </div>
          )}
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
            {appliedPromo?.discount.includes("FREE DELIVERY") ? (
              <div className="flex items-center gap-2">
                <span className="line-through text-gray-400">RM {baseDeliveryFee.toFixed(2)}</span>
                <span className="text-green-600 dark:text-green-400">FREE</span>
              </div>
            ) : (
              <span>RM {deliveryFee.toFixed(2)}</span>
            )}
          </div>
          {driverTip > 0 && (
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Driver Tip</span>
              <span>RM {driverTip.toFixed(2)}</span>
            </div>
          )}
          {appliedPromo && !appliedPromo.discount.includes("FREE DELIVERY") && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Promo Discount ({appliedPromo.code})</span>
              <span>-RM {discount.toFixed(2)}</span>
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
