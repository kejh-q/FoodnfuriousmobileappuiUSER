import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Bell, Package, Tag, Star, Utensils, MapPin, Clock, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { StoredNotification } from "../hooks/useNotificationStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

interface NotificationsPageProps {
  onNavigate: (page: string) => void;
  notifications: StoredNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export function NotificationsPage({ 
  onNavigate, 
  notifications: initialNotifications,
  markAsRead: markAsReadProp,
  markAllAsRead: markAllAsReadProp,
  clearAll: clearAllProp,
}: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<StoredNotification[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedNotification, setSelectedNotification] = useState<StoredNotification | null>(null);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);

  // Sync with parent state when initialNotifications changes
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="w-5 h-5" />;
      case "promotion":
        return <Tag className="w-5 h-5" />;
      case "delivery":
        return <MapPin className="w-5 h-5" />;
      case "system":
        return <Bell className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400";
      case "promotion":
        return "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400";
      case "delivery":
        return "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400";
      case "system":
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    }
  };

  const handleNotificationClick = (notification: StoredNotification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    markAsReadProp(id);
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
    markAllAsReadProp();
  };

  const clearAll = () => {
    setNotifications([]);
    clearAllProp();
    setShowClearAllDialog(false);
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white dark:bg-gray-900 pb-20 transition-colors duration-300"
    >
      {/* Header */}
      <div className="bg-[#FFD60A] dark:bg-yellow-600 px-6 pt-12 pb-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate("home")} className="text-gray-900 dark:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-gray-900 dark:text-white">Notifications</h1>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-gray-900 dark:text-white text-sm hover:opacity-80 transition-opacity"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === "all"
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-white/50 dark:bg-black/20 text-gray-900 dark:text-white"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === "unread"
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-white/50 dark:bg-black/20 text-gray-900 dark:text-white"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-6 mt-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-gray-900 dark:text-white mb-2">No notifications</p>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === "unread"
                ? "You're all caught up!"
                : "You'll see notifications here"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => (
              <motion.button
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full text-left bg-white dark:bg-gray-800 rounded-2xl p-4 border-2 transition-all hover:shadow-lg ${
                  !notification.isRead
                    ? "border-[#FFD60A] dark:border-yellow-600 shadow-md"
                    : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(
                      notification.type
                    )}`}
                  >
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`${!notification.isRead ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                        {notification.title}
                      </p>
                      <span className="text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-[#FFD60A] dark:bg-yellow-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Clear All Button */}
        {notifications.length > 0 && (
          <button
            onClick={() => setShowClearAllDialog(true)}
            className="w-full mt-6 py-3 text-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl transition-colors"
          >
            Clear All Notifications
          </button>
        )}
      </div>

      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border-0 max-w-md w-[calc(100%-2rem)] rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">Clear All Notifications?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              This will permanently delete all {notifications.length} notification{notifications.length !== 1 ? 's' : ''}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={clearAll}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Notification Detail Dialog */}
      <Dialog open={selectedNotification !== null} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent className="bg-white dark:bg-gray-800 border-0 max-w-md w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto rounded-3xl p-6">
          {selectedNotification && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>{selectedNotification.title}</DialogTitle>
                <DialogDescription>{selectedNotification.message}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Header with Icon */}
                <div className="flex items-start gap-4 pr-8">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(
                    selectedNotification.type
                  )}`}
                >
                  {getIcon(selectedNotification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 dark:text-white mb-1">
                    {selectedNotification.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedNotification.time}
                  </p>
                </div>
              </div>

              {/* Image if available */}
              {selectedNotification.image && (
                <div className="rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src={selectedNotification.image}
                    alt={selectedNotification.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* Message */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedNotification.message}
                </p>
              </div>

              {/* Action Buttons based on notification type */}
              {(selectedNotification.type === "order" || 
                selectedNotification.type === "promotion" || 
                selectedNotification.type === "delivery") && (
                <div className="flex gap-3 pt-2">
                  {selectedNotification.type === "order" && (
                    <button
                      onClick={() => {
                        setSelectedNotification(null);
                        onNavigate("order-history");
                      }}
                      className="w-full h-12 bg-[#FFD60A] hover:bg-[#FFC700] text-gray-900 rounded-xl transition-colors"
                    >
                      View Order
                    </button>
                  )}
                  {selectedNotification.type === "promotion" && (
                    <button
                      onClick={() => {
                        setSelectedNotification(null);
                        onNavigate("promo-codes");
                      }}
                      className="w-full h-12 bg-[#FFD60A] hover:bg-[#FFC700] text-gray-900 rounded-xl transition-colors"
                    >
                      View Promotions
                    </button>
                  )}
                  {selectedNotification.type === "delivery" && (
                    <button
                      onClick={() => {
                        setSelectedNotification(null);
                        onNavigate("home");
                      }}
                      className="w-full h-12 bg-[#FFD60A] hover:bg-[#FFC700] text-gray-900 rounded-xl transition-colors"
                    >
                      Track Delivery
                    </button>
                  )}
                </div>
              )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
