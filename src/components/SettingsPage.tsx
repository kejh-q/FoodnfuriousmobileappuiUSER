import { motion } from "motion/react";
import { ArrowLeft, Bell, Mail, Globe, Volume2, Trash2, Moon, Sun, Package, Tag } from "lucide-react";
import { useState } from "react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { useNotification } from "../hooks/useNotification";
import { useDarkMode } from "../hooks/useDarkMode";

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { showNotification } = useNotification();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [newCafes, setNewCafes] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteAccount = () => {
    // Clear user data
    localStorage.removeItem('um_eats_current_user');
    
    showNotification("success", "Account deletion request submitted");
    setShowDeleteDialog(false);
    
    // Navigate to login after a short delay
    setTimeout(() => {
      onNavigate("login");
    }, 1500);
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
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate("profile")} className="text-gray-900 dark:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-gray-900 dark:text-white">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-6 space-y-6">
        {/* Notifications Section */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-gray-900 dark:text-white">Push Notifications</p>
                  <p className="text-gray-500 dark:text-gray-400">Receive push notifications</p>
                </div>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>

            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-gray-900 dark:text-white">Email Notifications</p>
                  <p className="text-gray-500 dark:text-gray-400">Receive email updates</p>
                </div>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-gray-900 dark:text-white">Order Updates</p>
                  <p className="text-gray-500 dark:text-gray-400">Notifications about your orders</p>
                </div>
              </div>
              <Switch
                checked={orderUpdates}
                onCheckedChange={setOrderUpdates}
              />
            </div>

            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-gray-900 dark:text-white">Promotions</p>
                  <p className="text-gray-500 dark:text-gray-400">Special offers and deals</p>
                </div>
              </div>
              <Switch
                checked={promotions}
                onCheckedChange={setPromotions}
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-gray-900 dark:text-white">New Cafés</p>
                  <p className="text-gray-500 dark:text-gray-400">Updates about new restaurants</p>
                </div>
              </div>
              <Switch
                checked={newCafes}
                onCheckedChange={setNewCafes}
              />
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-4">App Preferences</h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <div>
                  <p className="text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-gray-500 dark:text-gray-400">Use dark theme</p>
                </div>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>

            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-gray-900 dark:text-white">Language</p>
                  <p className="text-gray-500 dark:text-gray-400">English</p>
                </div>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-gray-900 dark:text-white">Sound Effects</p>
                  <p className="text-gray-500 dark:text-gray-400">App sounds and alerts</p>
                </div>
              </div>
              <Switch
                checked={soundEffects}
                onCheckedChange={setSoundEffects}
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-4">About</h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">App Version</p>
              <p className="text-gray-900 dark:text-white">1.0.0</p>
            </div>

            <button 
              onClick={() => window.open('https://www.um.edu.my', '_blank')}
              className="w-full p-4 text-left border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <p className="text-gray-900 dark:text-white">Terms of Service</p>
            </button>

            <button 
              onClick={() => window.open('https://www.um.edu.my', '_blank')}
              className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <p className="text-gray-900 dark:text-white">Privacy Policy</p>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h3 className="text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-red-200 dark:border-red-900 overflow-hidden transition-colors duration-300">
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full p-4 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div className="text-left">
                <p className="text-red-600 dark:text-red-400">Delete Account</p>
                <p className="text-red-500 dark:text-red-500">Permanently delete your account</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 max-w-sm mx-auto rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">
              Delete Account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
