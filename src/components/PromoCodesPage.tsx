import { motion } from "motion/react";
import { ArrowLeft, Tag, Copy, Check, Plus, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { toast } from "sonner@2.0.3";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useAuth } from "../hooks/useAuth";

interface PromoCodesPageProps {
  onNavigate: (page: string) => void;
}

interface PromoCode {
  id: number;
  code: string;
  description: string;
  discount: string;
  validUntil: string;
  minSpend?: number;
  isActive: boolean;
}

export function PromoCodesPage({ onNavigate }: PromoCodesPageProps) {
  const { currentUser } = useAuth();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    {
      id: 1,
      code: "WELCOME20",
      description: "Welcome bonus for new users",
      discount: "20% OFF",
      validUntil: "31 Dec 2025",
      minSpend: 15,
      isActive: true,
    },
    {
      id: 2,
      code: "UMSTUDENT",
      description: "Special discount for UM students",
      discount: "RM 5 OFF",
      validUntil: "31 Dec 2025",
      minSpend: 20,
      isActive: true,
    },
    {
      id: 3,
      code: "FREESHIP",
      description: "Free delivery on all orders",
      discount: "FREE DELIVERY",
      validUntil: "15 Dec 2025",
      isActive: true,
    },
  ]);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState("");

  const handleCopyCode = (code: string) => {
    // Try modern clipboard API first, fallback to older method
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopiedCode(code);
          toast.success("Promo code copied!");
          setTimeout(() => setCopiedCode(null), 2000);
        })
        .catch(() => {
          // Fallback to older method
          fallbackCopyTextToClipboard(code);
        });
    } else {
      // Fallback to older method
      fallbackCopyTextToClipboard(code);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setCopiedCode(text);
        toast.success("Promo code copied!");
        setTimeout(() => setCopiedCode(null), 2000);
      } else {
        toast.error("Failed to copy code. Please copy manually.");
      }
    } catch (err) {
      toast.error("Failed to copy code. Please copy manually.");
    }
    
    document.body.removeChild(textArea);
  };

  const handleApplyPromoCode = () => {
    if (!newPromoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    const existingCode = promoCodes.find(
      (promo) => promo.code.toLowerCase() === newPromoCode.toUpperCase()
    );

    if (existingCode) {
      toast.success(`Promo code ${newPromoCode} applied!`);
      setNewPromoCode("");
      setShowAddDialog(false);
    } else {
      toast.error("Invalid promo code");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white dark:bg-gray-900 pb-20 transition-colors duration-300"
    >
      {/* Header */}
      <div className="bg-[#FFD60A] dark:bg-yellow-600 px-6 pt-12 pb-8 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate("profile")} className="text-gray-900 dark:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-gray-900 dark:text-white">Promo Codes</h1>
          </div>
          <button
            onClick={() => setShowAddDialog(true)}
            className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-6">
        {/* Verification Required Alert */}
        {!currentUser?.isVerified && currentUser?.userType !== "Guest" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-2 border-orange-300 dark:border-orange-700 rounded-2xl p-6 text-center"
          >
            <div className="w-16 h-16 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-gray-900 dark:text-white mb-2">Verification Required</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Promo codes are only available for verified users. Verify your email to unlock exclusive discounts!
            </p>
            <Button
              onClick={() => onNavigate("profile")}
              className="bg-[#FFD60A] hover:bg-[#FFC700] dark:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl"
            >
              Verify Email Now
            </Button>
          </motion.div>
        )}

        {currentUser?.userType === "Guest" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-2 border-blue-300 dark:border-blue-700 rounded-2xl p-6 text-center"
          >
            <div className="w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-gray-900 dark:text-white mb-2">Promo Codes Unavailable</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Guest users cannot access promo codes. Create a UM Student or UM Staff account to unlock exclusive discounts!
            </p>
          </motion.div>
        )}

        {currentUser?.isVerified && (
          <div className="space-y-4">
          {promoCodes.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-[#FFD60A] to-[#FFC700] dark:from-yellow-600 dark:to-yellow-700 rounded-2xl p-[2px] transition-colors duration-300"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#FFD60A] dark:text-yellow-500" />
                    <span className="text-gray-900 dark:text-white">{promo.discount}</span>
                  </div>
                  {promo.isActive && (
                    <span className="text-xs bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                <h3 className="text-gray-900 dark:text-white mb-1">{promo.description}</h3>
                
                {promo.minSpend && (
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    Min. spend: RM {promo.minSpend}
                  </p>
                )}

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Valid until {promo.validUntil}
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <code className="text-gray-900 dark:text-white tracking-wider">
                      {promo.code}
                    </code>
                  </div>
                  <button
                    onClick={() => handleCopyCode(promo.code)}
                    className="w-12 h-12 bg-[#FFD60A] dark:bg-yellow-600 hover:bg-[#FFC700] dark:hover:bg-yellow-700 rounded-xl flex items-center justify-center transition-colors"
                  >
                    {copiedCode === promo.code ? (
                      <Check className="w-5 h-5 text-gray-900 dark:text-white" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-900 dark:text-white" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {/* Info Section */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-4 transition-colors duration-300">
          <h3 className="text-blue-900 dark:text-blue-300 mb-2">How to use promo codes:</h3>
          <ul className="space-y-1 text-blue-700 dark:text-blue-400">
            <li>• Copy the promo code</li>
            <li>• Proceed to checkout</li>
            <li>• Paste the code in the promo code field</li>
            <li>• Enjoy your discount!</li>
          </ul>
          </div>
        </div>
        )}
      </div>

      {/* Add Promo Code Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-100 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Enter Promo Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Enter promo code"
              className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 uppercase"
              value={newPromoCode}
              onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
            />
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddDialog(false)}
                variant="outline"
                className="flex-1 rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyPromoCode}
                className="flex-1 bg-[#FFD60A] hover:bg-[#FFC700] dark:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl"
              >
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}