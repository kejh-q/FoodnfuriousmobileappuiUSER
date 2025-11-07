import { motion } from "motion/react";
import { ArrowLeft, CreditCard, Smartphone, Plus, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface PaymentMethodsPageProps {
  onNavigate: (page: string) => void;
}

const paymentMethods = [
  {
    id: 1,
    type: "card",
    name: "Visa •••• 4242",
    icon: CreditCard,
    default: true,
  },
  {
    id: 2,
    type: "ewallet",
    name: "Touch 'n Go eWallet",
    icon: Smartphone,
    default: false,
  },
  {
    id: 3,
    type: "card",
    name: "Mastercard •••• 8888",
    icon: CreditCard,
    default: false,
  },
];

export function PaymentMethodsPage({ onNavigate }: PaymentMethodsPageProps) {
  const [selectedPayment, setSelectedPayment] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pb-20"
    >
      {/* Header */}
      <div className="bg-[#FFD60A] px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => onNavigate("profile")} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-gray-900">Payment Methods</h1>
        </div>
      </div>

      {/* Payment Methods List */}
      <div className="px-6 mt-6">
        <div className="space-y-3 mb-6">
          {paymentMethods.map((method, index) => (
            <motion.button
              key={method.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedPayment(method.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                selectedPayment === method.id
                  ? "border-[#FFD60A] bg-[#FFF9E6]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedPayment === method.id ? "bg-[#FFD60A]" : "bg-gray-100"
                }`}
              >
                <method.icon
                  className={`w-6 h-6 ${
                    selectedPayment === method.id ? "text-gray-900" : "text-gray-600"
                  }`}
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-gray-900">{method.name}</h3>
                {method.default && (
                  <span className="text-xs text-gray-600">Default</span>
                )}
              </div>
              {selectedPayment === method.id && (
                <div className="w-6 h-6 bg-[#FFD60A] rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-gray-900" />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Add New Payment Method */}
        <Button
          variant="outline"
          className="w-full h-14 border-2 border-[#FFD60A] text-gray-900 hover:bg-[#FFF9E6] rounded-xl mb-4"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Payment Method
        </Button>

        {/* Info Card */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <p className="text-blue-900 mb-1">Secure Payments</p>
          <p className="text-blue-700">
            All payment information is encrypted and secured. We never store your full card details.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
