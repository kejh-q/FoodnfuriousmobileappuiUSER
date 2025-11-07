import { motion } from "motion/react";
import { useEffect } from "react";

interface FindingDriverPageProps {
  onNavigate: (page: string) => void;
}

export function FindingDriverPage({ onNavigate }: FindingDriverPageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate("tracking");
    }, 3000);
    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white flex flex-col"
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

        {/* Location Pin Overlay */}
        <motion.div
          initial={{ scale: 0, y: -100 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <div className="w-12 h-12 bg-[#FFD60A] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl">📍</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Card */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-t-3xl p-6 shadow-2xl"
      >
        <div className="flex flex-col items-center">
          {/* Loading Animation */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-gray-200 border-t-[#FFD60A] rounded-full mb-6"
          />

          <h2 className="text-gray-900 mb-2">Finding a Driver</h2>
          <p className="text-gray-600 text-center mb-6">
            We're searching for the nearest available driver for your order
          </p>

          {/* Pulsing Dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 bg-[#FFD60A] rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
