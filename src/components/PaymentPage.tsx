import { motion } from "motion/react";
import { ArrowLeft, CreditCard, Wallet, DollarSign, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import type { CheckoutData } from "./CheckoutPage";

interface PaymentPageProps {
  onNavigate: (page: string) => void;
  onPaymentComplete: () => void;
  checkoutData: CheckoutData | null;
}

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Visa, Mastercard, Amex",
  },
  {
    id: "ewallet",
    name: "E-Wallet",
    icon: Wallet,
    description: "Touch 'n Go, GrabPay, Boost",
  },
  {
    id: "cash",
    name: "Cash on Delivery",
    icon: DollarSign,
    description: "Pay when you receive",
  },
];

export function PaymentPage({ onNavigate, onPaymentComplete, checkoutData }: PaymentPageProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <p className="text-gray-600 dark:text-gray-400">No order data found</p>
      </div>
    );
  }

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
          <button onClick={() => onNavigate("checkout")} className="text-gray-900 dark:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-gray-900 dark:text-white">Payment</h1>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 transition-colors duration-300"
        >
          <h3 className="text-gray-900 dark:text-white mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Subtotal</span>
              <span>RM {checkoutData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Delivery Fee</span>
              <span>RM {checkoutData.deliveryFee.toFixed(2)}</span>
            </div>
            {checkoutData.driverTip > 0 && (
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Driver Tip</span>
                <span>RM {checkoutData.driverTip.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-300 dark:border-gray-700 pt-2 flex justify-between text-gray-900 dark:text-white">
              <span>Total Amount</span>
              <span>RM {checkoutData.total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h3 className="text-gray-900 dark:text-white mb-3">Select Payment Method</h3>
          {paymentMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.button
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  selectedMethod === method.id
                    ? "border-[#FFD60A] dark:border-yellow-600 bg-[#FFF9E6] dark:bg-yellow-900/30"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      selectedMethod === method.id
                        ? "bg-[#FFD60A] dark:bg-yellow-600"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        selectedMethod === method.id
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p
                      className={`${
                        selectedMethod === method.id
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {method.name}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{method.description}</p>
                  </div>
                  {selectedMethod === method.id && (
                    <CheckCircle2 className="w-6 h-6 text-[#FFD60A] dark:text-yellow-500" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-4 transition-colors duration-300"
        >
          <p className="text-blue-900 dark:text-blue-200 text-sm">
            💳 This is a demo app. No actual payment will be processed. Your order will be placed
            immediately after clicking the payment button.
          </p>
        </motion.div>
      </div>

      {/* Confirm Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-gray-100 dark:border-gray-800 p-6 max-w-[430px] mx-auto transition-colors duration-300">
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full h-14 bg-[#FFD60A] dark:bg-yellow-600 hover:bg-[#FFC700] dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl transition-colors disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            `Confirm Payment - RM ${checkoutData.total.toFixed(2)}`
          )}
        </Button>
      </div>
    </motion.div>
  );
}
