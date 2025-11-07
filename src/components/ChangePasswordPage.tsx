import { motion } from "motion/react";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification";

interface ChangePasswordPageProps {
  onNavigate: (page: string) => void;
}

export function ChangePasswordPage({ onNavigate }: ChangePasswordPageProps) {
  const { currentUser, updatePassword } = useAuth();
  const { showNotification } = useNotification();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      showNotification("error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification("error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      showNotification("error", "Password must be at least 8 characters long");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      showNotification("error", "Password must contain uppercase, lowercase, and number");
      return;
    }

    // Update password with current password verification
    const result = updatePassword(currentPassword, newPassword);
    
    if (!result.success) {
      showNotification("error", result.message);
      return;
    }

    showNotification("success", "🔒 Password changed successfully!");
    
    // Clear form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    
    // Navigate back after short delay
    setTimeout(() => onNavigate("profile"), 1500);
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
          <h1 className="text-gray-900 dark:text-white">Change Password</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-8">
        <form onSubmit={handleChangePassword} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                className="h-14 pl-12 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="h-14 pl-12 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="h-14 pl-12 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-4">
            <p className="text-blue-900 dark:text-blue-300 mb-2">
              Password Requirements:
            </p>
            <ul className="space-y-1 text-blue-700 dark:text-blue-400">
              <li className="flex items-center gap-2">
                <span className={newPassword.length >= 8 ? "text-green-600" : ""}>
                  • At least 8 characters
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
                  • One uppercase letter
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>
                  • One lowercase letter
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className={/\d/.test(newPassword) ? "text-green-600" : ""}>
                  • One number
                </span>
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-14 bg-[#FFD60A] hover:bg-[#FFC700] dark:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl"
          >
            Change Password
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
