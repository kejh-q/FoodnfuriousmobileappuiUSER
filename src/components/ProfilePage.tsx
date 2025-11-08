import { motion } from "motion/react";
import { ArrowLeft, User, Mail, Phone, MapPin, ChevronRight, LogOut, GraduationCap, Briefcase, Users, CheckCircle, XCircle, Edit, Camera, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ProfilePageProps {
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AVATAR_OPTIONS = ["👤", "😀", "😎", "🤓", "😊", "🥳", "🤠", "👨‍🎓", "👩‍🎓", "👨‍💼", "👩‍💼", "🧑‍🍳"];

export function ProfilePage({ onNavigate, isDarkMode, toggleDarkMode }: ProfilePageProps) {
  const { currentUser, logout, verifyEmail, updateUser } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate("login");
  };

  const handleVerify = () => {
    const result = verifyEmail(verificationCode);
    if (result.success) {
      alert(result.message);
      setShowVerification(false);
      setVerificationCode("");
    } else {
      alert(result.message);
    }
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/[^0-9]/g, ""));
  };

  const handlePhoneEdit = () => {
    setNewPhone(currentUser?.phone || "");
    setIsEditingPhone(true);
  };

  const handlePhoneSave = () => {
    if (!newPhone.trim()) {
      alert("Phone number is required");
      return;
    }

    if (!validatePhone(newPhone)) {
      alert("Please enter a valid phone number (10-11 digits)");
      return;
    }

    updateUser({ phone: newPhone });
    setIsEditingPhone(false);
    alert("Phone number updated successfully");
  };

  const handlePhoneCancel = () => {
    setIsEditingPhone(false);
    setNewPhone("");
  };

  const handleAvatarSelect = (avatar: string) => {
    updateUser({ avatar });
    setShowAvatarDialog(false);
  };

  const getUserTypeIcon = () => {
    switch (currentUser?.userType) {
      case "UM Student":
        return <GraduationCap className="w-5 h-5 text-gray-600" />;
      case "UM Staff":
        return <Briefcase className="w-5 h-5 text-gray-600" />;
      default:
        return <Users className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white dark:bg-gray-900 pb-20 transition-colors duration-300"
    >
      {/* Header */}
      <div className="bg-[#FFD60A] dark:bg-yellow-600 px-6 pt-12 pb-8 transition-colors duration-300">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => onNavigate("home")} className="text-gray-900 dark:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-gray-900 dark:text-white">Profile</h1>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-4 transition-colors duration-300">
          <div className="relative">
            <div className="w-16 h-16 bg-[#FFD60A] rounded-full flex items-center justify-center text-3xl">
              {currentUser.avatar || "👤"}
            </div>
            <button
              onClick={() => setShowAvatarDialog(true)}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-gray-900 dark:text-white">{currentUser.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{currentUser.userType}</p>
          </div>
          {currentUser.userType !== "Guest" && (
            <div className="flex items-center gap-2">
              {currentUser.isVerified ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs">Verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-orange-600">
                  <XCircle className="w-4 h-4" />
                  <span className="text-xs">Unverified</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-6">
        {/* Email Verification Alert */}
        {!currentUser.isVerified && currentUser.userType !== "Guest" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl"
          >
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-900 mb-1">Email Verification Required</p>
                <p className="text-gray-600 text-sm mb-3">
                  Please verify your email to unlock exclusive benefits:
                </p>
                <ul className="text-gray-600 text-sm space-y-1 mb-3 ml-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FFD60A] mt-0.5">✓</span>
                    <span>Access to exclusive promo codes and discounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FFD60A] mt-0.5">✓</span>
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FFD60A] mt-0.5">✓</span>
                    <span>Special offers and early access to new features</span>
                  </li>
                </ul>
                {!showVerification ? (
                  <Button
                    onClick={() => setShowVerification(true)}
                    className="h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
                  >
                    Verify Email
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Enter verification code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="h-10 px-3 rounded-xl border-2 border-orange-200 focus:border-orange-400"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleVerify}
                        className="h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
                      >
                        Verify
                      </Button>
                      <Button
                        onClick={() => setShowVerification(false)}
                        variant="outline"
                        className="h-10 border-2 border-orange-200 text-orange-600 rounded-xl"
                      >
                        Cancel
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Demo code: 123456</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Account Information */}
        <div className="mb-6">
          <h3 className="text-gray-900 dark:text-white mb-4">Account Information</h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                {getUserTypeIcon()}
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-600 dark:text-gray-400">User Type</p>
                <p className="text-gray-900 dark:text-white">{currentUser.userType}</p>
              </div>
            </button>
            <button className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white">{currentUser.email}</p>
              </div>
              {currentUser.userType !== "Guest" && (
                <div>
                  {currentUser.isVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-orange-600" />
                  )}
                </div>
              )}
            </button>
            
            {/* Phone Number Section - Editable */}
            <div className="w-full p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                {!isEditingPhone ? (
                  <>
                    <div className="flex-1 text-left">
                      <p className="text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="text-gray-900 dark:text-white">{currentUser.phone}</p>
                    </div>
                    <button
                      onClick={handlePhoneEdit}
                      className="text-[#FFD60A] dark:text-yellow-500 hover:text-[#E6C000] dark:hover:text-yellow-600 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <div className="flex-1">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Phone</p>
                    <div className="space-y-2">
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="h-10 px-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:border-[#FFD60A] dark:focus:border-yellow-600"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handlePhoneSave}
                          className="h-9 bg-[#FFD60A] hover:bg-[#E6C000] dark:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl flex-1"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={handlePhoneCancel}
                          variant="outline"
                          className="h-9 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 dark:bg-gray-700 rounded-xl flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => onNavigate("location")}
              className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-600 dark:text-gray-400">Default Location</p>
                <p className="text-gray-900 dark:text-white">{currentUser.defaultLocation || "Kolej Kediaman 12"}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
          </div>
        </div>

        {/* Menu Options */}
        <div className="mb-6">
          <h3 className="text-gray-900 dark:text-white mb-4">Menu</h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <button
              onClick={() => onNavigate("order-history")}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
            >
              <span className="text-gray-900 dark:text-white">Order History</span>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
            <button 
              onClick={() => onNavigate("favorites")}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
            >
              <span className="text-gray-900 dark:text-white">My Favorites</span>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
            <button 
              onClick={() => onNavigate("addresses")}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
            >
              <span className="text-gray-900 dark:text-white">My Addresses</span>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
            <button 
              onClick={() => onNavigate("payment-methods")}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
            >
              <span className="text-gray-900 dark:text-white">Payment Methods</span>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
            <button 
              onClick={() => onNavigate("change-password")}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
            >
              <span className="text-gray-900 dark:text-white">Change Password</span>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
            <button 
              onClick={() => onNavigate("settings")}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
            >
              <span className="text-gray-900 dark:text-white">Settings</span>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
            <button 
              onClick={() => onNavigate("help-support")}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
            >
              <span className="text-gray-900 dark:text-white">Help & Support</span>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
            <button 
              onClick={toggleDarkMode}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
                <span className="text-gray-900 dark:text-white">
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                isDarkMode ? "bg-yellow-500" : "bg-gray-300"
              } relative`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isDarkMode ? "translate-x-7" : "translate-x-1"
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-14 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>

      {/* Avatar Selection Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-100 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Choose Avatar</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-3 py-4">
            {AVATAR_OPTIONS.map((avatar, index) => (
              <button
                key={index}
                onClick={() => handleAvatarSelect(avatar)}
                className={`w-full aspect-square rounded-2xl flex items-center justify-center text-4xl transition-all hover:scale-105 ${
                  currentUser.avatar === avatar
                    ? "bg-[#FFD60A] dark:bg-yellow-600 ring-2 ring-[#FFD60A] dark:ring-yellow-600 ring-offset-2 dark:ring-offset-gray-800"
                    : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
