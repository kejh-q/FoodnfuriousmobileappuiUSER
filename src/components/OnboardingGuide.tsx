import { motion } from "motion/react";
import { X, ShoppingCart, MapPin, Search, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface OnboardingGuideProps {
  onComplete: () => void;
  userName?: string;
}

const steps = [
  {
    icon: Search,
    title: "Discover Cafés",
    description: "Browse through popular cafés around UM campus and explore their delicious menus",
    color: "bg-blue-500",
  },
  {
    icon: ShoppingCart,
    title: "Add to Cart",
    description: "Select your favorite dishes and add them to your cart with just a tap",
    color: "bg-green-500",
  },
  {
    icon: MapPin,
    title: "Choose Location",
    description: "Select your delivery location from various pickup points around campus",
    color: "bg-purple-500",
  },
  {
    icon: Bell,
    title: "Track Your Order",
    description: "Get real-time updates and track your order from preparation to delivery",
    color: "bg-[#FFD60A]",
  },
];

export function OnboardingGuide({ onComplete, userName }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  console.log("🎓 OnboardingGuide component rendered!", { userName, currentStep });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={handleSkip}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Welcome Message */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h2 className="text-gray-900 dark:text-white mb-2">
              Welcome{userName ? `, ${userName}` : ""}! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Let's show you around
            </p>
          </motion.div>
        )}

        {/* Icon */}
        <motion.div
          key={currentStep}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.6 }}
          className={`w-20 h-20 ${currentStepData.color} rounded-full flex items-center justify-center mx-auto mb-6`}
        >
          <Icon className="w-10 h-10 text-white" />
        </motion.div>

        {/* Content */}
        <motion.div
          key={`content-${currentStep}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h3 className="text-gray-900 dark:text-white mb-3">
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {currentStepData.description}
          </p>
        </motion.div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-[#FFD60A]"
                  : index < currentStep
                  ? "w-2 bg-[#FFD60A]/50"
                  : "w-2 bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {currentStep < steps.length - 1 ? (
            <>
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Skip
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 h-12 bg-[#FFD60A] hover:bg-[#FFC700] text-gray-900 rounded-xl"
              >
                Next
              </Button>
            </>
          ) : (
            <Button
              onClick={onComplete}
              className="w-full h-12 bg-[#FFD60A] hover:bg-[#FFC700] text-gray-900 rounded-xl"
            >
              Get Started 🚀
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
