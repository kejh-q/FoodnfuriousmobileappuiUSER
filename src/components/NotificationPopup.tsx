import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useNotification } from "../hooks/useNotification";

export function NotificationPopup() {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6" />;
      case "error":
        return <XCircle className="w-6 h-6" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6" />;
      case "info":
        return <Info className="w-6 h-6" />;
      default:
        return <Info className="w-6 h-6" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-950",
          border: "border-green-500 dark:border-green-600",
          icon: "text-green-600 dark:text-green-400",
          text: "text-green-900 dark:text-green-200",
        };
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-950",
          border: "border-red-500 dark:border-red-600",
          icon: "text-red-600 dark:text-red-400",
          text: "text-red-900 dark:text-red-200",
        };
      case "warning":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-950",
          border: "border-yellow-500 dark:border-yellow-600",
          icon: "text-yellow-600 dark:text-yellow-400",
          text: "text-yellow-900 dark:text-yellow-200",
        };
      case "info":
        return {
          bg: "bg-blue-50 dark:bg-blue-950",
          border: "border-blue-500 dark:border-blue-600",
          icon: "text-blue-600 dark:text-blue-400",
          text: "text-blue-900 dark:text-blue-200",
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-800",
          border: "border-gray-500 dark:border-gray-600",
          icon: "text-gray-600 dark:text-gray-400",
          text: "text-gray-900 dark:text-gray-200",
        };
    }
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-[9999] pointer-events-none">
      <div className="max-w-md mx-auto space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => {
            const colors = getColors(notification.type);
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 400,
                }}
                className="pointer-events-auto"
              >
                <div
                  className={`${colors.bg} ${colors.border} border-l-4 rounded-xl shadow-2xl p-4 backdrop-blur-sm transition-colors duration-300`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`${colors.icon} flex-shrink-0 mt-0.5`}>
                      {getIcon(notification.type)}
                    </div>
                    <p className={`${colors.text} flex-1 leading-tight`}>
                      {notification.message}
                    </p>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className={`${colors.icon} hover:opacity-70 transition-opacity flex-shrink-0`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
