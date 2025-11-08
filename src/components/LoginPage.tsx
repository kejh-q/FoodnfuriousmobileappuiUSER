import { motion } from "motion/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { UtensilsCrossed, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { email: "", password: "" };

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    // If no errors, attempt to login
    if (!newErrors.email && !newErrors.password) {
      const result = login(email, password);
      
      if (result.success) {
        showNotification("success", "✨ Login successful! Welcome back.");
        setTimeout(() => onNavigate("home"), 500);
      } else {
        showNotification("error", result.message);
        setErrors({ email: "", password: result.message });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-12 border border-gray-100 dark:border-gray-800">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="w-20 h-20 rounded-full bg-[#FFD60A] flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-10 h-10 text-gray-900" />
          </div>
          <h1 className="text-gray-900 mb-2">Food n Furious</h1>
          <p className="text-gray-600">Food delivery for UM community</p>
        </motion.div>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`h-14 px-4 rounded-xl border-2 ${
                errors.email ? "border-red-500" : "border-gray-200"
              } focus:border-[#FFD60A]`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <Button
            type="submit"
            className="w-full h-14 bg-[#FFD60A] hover:bg-[#FFC700] text-gray-900 rounded-xl"
          >
            Login
          </Button>
        </motion.form>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate("signup")}
            className="text-gray-600 hover:text-gray-900"
          >
            Don't have an account? <span className="text-[#FFD60A]">Sign Up</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
