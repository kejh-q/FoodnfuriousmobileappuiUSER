import { motion } from "motion/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowLeft, Eye, EyeOff, GraduationCap, Briefcase, Users, X } from "lucide-react";
import { useState } from "react";
import { useAuth, UserType } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification";

interface SignUpPageProps {
  onNavigate: (page: string) => void;
}

export function SignUpPage({ onNavigate }: SignUpPageProps) {
  const { signUp, login } = useAuth();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "UM Student" as UserType,
    allergies: [] as string[],
    otherAllergy: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "",
  });

  const presetAllergies = [
    "Peanuts",
    "Tree Nuts",
    "Milk",
    "Eggs",
    "Shellfish",
    "Fish",
    "Soy",
    "Wheat/Gluten",
  ];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/[^0-9]/g, ""));
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      userType: "",
    };

    // Name validation
    if (!formData.name) {
      newErrors.name = "Full name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    // If no errors, proceed to sign up
    if (Object.values(newErrors).every((error) => error === "")) {
      // Combine preset allergies and other allergy
      const allergies = [...formData.allergies];
      if (formData.otherAllergy.trim()) {
        allergies.push(formData.otherAllergy.trim());
      }

      const result = signUp({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: formData.userType,
        allergies: allergies.length > 0 ? allergies : undefined,
      });

      if (result.success) {
        // Auto-login the user
        const loginResult = login(formData.email, formData.password);
        
        if (loginResult.success && loginResult.user) {
          // Mark that this is a first-time login after signup for onboarding
          const firstLoginKey = `um_eats_first_login_${loginResult.user.id}`;
          localStorage.setItem(firstLoginKey, "true");
          
          console.log("🎯 SignUp: Set first login flag:", {
            userId: loginResult.user.id,
            key: firstLoginKey,
            value: localStorage.getItem(firstLoginKey),
          });
          
          // Show success message with verification benefits
          if (result.needsVerification) {
            showNotification("success", `🎉 Welcome! Check your email for verification. Verify to unlock exclusive promo codes!`);
          } else {
            showNotification("success", "🎉 Welcome to Food n Furious!");
          }
          
          // Navigate to home with a delay to ensure auth state updates
          setTimeout(() => {
            console.log("🚀 SignUp: Navigating to home page");
            console.log("🔑 SignUp: First login flag before navigation:", {
              key: firstLoginKey,
              value: localStorage.getItem(firstLoginKey),
              allKeys: Object.keys(localStorage).filter(k => k.includes('first_login')),
            });
            onNavigate("home");
          }, 800);
        }
      } else {
        // Show error message
        showNotification("error", result.message);
        setErrors({ ...newErrors, email: result.message });
      }
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAllergy = (allergy: string) => {
    setFormData((prev) => {
      const allergies = prev.allergies.includes(allergy)
        ? prev.allergies.filter((a) => a !== allergy)
        : [...prev.allergies, allergy];
      return { ...prev, allergies };
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6"
    >
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left side - Branding */}
          <div className="hidden md:flex flex-col items-center justify-center bg-[#FFD60A] dark:bg-yellow-600 p-12">
            <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center mb-6">
              <GraduationCap className="w-12 h-12 text-[#FFD60A] dark:text-yellow-600" />
            </div>
            <h2 className="text-gray-900 dark:text-white mb-4 text-center">Join Food n Furious</h2>
            <p className="text-gray-700 dark:text-gray-300 text-center">
              Fast food delivery for the UM community
            </p>
          </div>

          {/* Right side - Form */}
          <div className="p-8 md:p-12">
            <button
              onClick={() => onNavigate("login")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-gray-900 dark:text-white mb-2">Create Account</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Get started with your account</p>

              <form onSubmit={handleSignUp} className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            <div>
              <Input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`h-14 px-4 rounded-xl border-2 ${
                  errors.name ? "border-red-500" : "border-gray-200"
                } focus:border-[#FFD60A]`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 ml-2">{errors.name}</p>
              )}
            </div>

            {/* User Type Selection */}
            <div>
              <p className="text-gray-700 mb-3">I am a</p>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange("userType", "UM Student")}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    formData.userType === "UM Student"
                      ? "border-[#FFD60A] bg-[#FFF9E6]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    formData.userType === "UM Student" ? "bg-[#FFD60A]" : "bg-gray-100"
                  }`}>
                    <GraduationCap className={`w-5 h-5 ${
                      formData.userType === "UM Student" ? "text-gray-900" : "text-gray-600"
                    }`} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-gray-900">UM Student</p>
                    <p className="text-gray-500 text-xs">@siswa.um.edu.my</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange("userType", "UM Staff")}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    formData.userType === "UM Staff"
                      ? "border-[#FFD60A] bg-[#FFF9E6]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    formData.userType === "UM Staff" ? "bg-[#FFD60A]" : "bg-gray-100"
                  }`}>
                    <Briefcase className={`w-5 h-5 ${
                      formData.userType === "UM Staff" ? "text-gray-900" : "text-gray-600"
                    }`} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-gray-900">UM Staff</p>
                    <p className="text-gray-500 text-xs">@um.edu.my</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange("userType", "Guest")}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    formData.userType === "Guest"
                      ? "border-[#FFD60A] bg-[#FFF9E6]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    formData.userType === "Guest" ? "bg-[#FFD60A]" : "bg-gray-100"
                  }`}>
                    <Users className={`w-5 h-5 ${
                      formData.userType === "Guest" ? "text-gray-900" : "text-gray-600"
                    }`} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-gray-900">Guest</p>
                    <p className="text-gray-500 text-xs">Any email address</p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`h-14 px-4 rounded-xl border-2 ${
                  errors.email ? "border-red-500" : "border-gray-200"
                } focus:border-[#FFD60A]`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>
              )}
            </div>
            <div>
              <Input
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={`h-14 px-4 rounded-xl border-2 ${
                  errors.phone ? "border-red-500" : "border-gray-200"
                } focus:border-[#FFD60A]`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 ml-2">{errors.phone}</p>
              )}
            </div>

            {/* Food Allergies Section */}
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">Food Allergies (Optional)</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {presetAllergies.map((allergy) => (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => toggleAllergy(allergy)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      formData.allergies.includes(allergy)
                        ? "border-[#FFD60A] bg-[#FFF9E6] dark:bg-yellow-900/20 text-gray-900 dark:text-white"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
              <Input
                type="text"
                placeholder="Other allergies (separate with comma)"
                value={formData.otherAllergy}
                onChange={(e) => handleChange("otherAllergy", e.target.value)}
                className="h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#FFD60A]"
              />
              {(formData.allergies.length > 0 || formData.otherAllergy) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-gray-900 dark:text-white rounded-full text-xs"
                    >
                      {allergy}
                      <button
                        type="button"
                        onClick={() => toggleAllergy(allergy)}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`h-14 px-4 pr-12 rounded-xl border-2 ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  } focus:border-[#FFD60A]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-2">{errors.password}</p>
              )}
            </div>
            <div>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className={`h-14 px-4 pr-12 rounded-xl border-2 ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-200"
                  } focus:border-[#FFD60A]`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
                <Button
                  type="submit"
                  className="w-full h-14 bg-[#FFD60A] dark:bg-yellow-600 hover:bg-[#FFC700] dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl mt-6"
                >
                  Sign Up
                </Button>
              </form>

              <div className="mt-6 text-center">
                  <button
                    onClick={() => onNavigate("login")}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Already have an account? <span className="text-[#FFD60A] dark:text-yellow-600">Login</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
    </motion.div>
  );
}
