import { useState, useEffect } from "react";

export type UserType = "UM Student" | "UM Staff" | "Guest";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: UserType;
  isVerified: boolean;
  createdAt: string;
  defaultLocation?: string;
  avatar?: string;
  allergies?: string[];
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderHistory {
  userId: string;
  orders: Array<{
    id: string;
    date: string;
    time: string;
    status: string;
    items: OrderItem[];
    total: number;
    cafe: string;
    image: string;
  }>;
}

const USERS_KEY = "um_eats_users";
const CURRENT_USER_KEY = "um_eats_current_user";
const ORDERS_KEY = "um_eats_orders";

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Load current user from localStorage on mount
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Listen for auth changes from other components
    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (updatedUser) {
        setCurrentUser(JSON.parse(updatedUser));
      } else {
        setCurrentUser(null);
      }
    };

    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  const getAllUsers = (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const validateEmail = (email: string, userType: UserType): { valid: boolean; message: string } => {
    const lowerEmail = email.toLowerCase();
    
    if (userType === "UM Student") {
      if (!lowerEmail.endsWith("@siswa.um.edu.my")) {
        return { valid: false, message: "UM Students must use @siswa.um.edu.my email" };
      }
    } else if (userType === "UM Staff") {
      if (!lowerEmail.endsWith("@um.edu.my")) {
        return { valid: false, message: "UM Staff must use @um.edu.my email" };
      }
    }
    
    return { valid: true, message: "" };
  };

  const signUp = (userData: Omit<User, "id" | "createdAt" | "isVerified">): { success: boolean; message: string; needsVerification?: boolean } => {
    const users = getAllUsers();
    
    // Check if email already exists
    const emailExists = users.some(user => user.email === userData.email);
    if (emailExists) {
      return { success: false, message: "Email already registered" };
    }

    // Validate email based on user type
    const emailValidation = validateEmail(userData.email, userData.userType);
    if (!emailValidation.valid) {
      return { success: false, message: emailValidation.message };
    }

    // Create new user
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      defaultLocation: "Kolej Kediaman 12",
      isVerified: false,
    };

    users.push(newUser);
    saveUsers(users);

    // Send verification email (simulated)
    if (userData.userType !== "Guest") {
      console.log(`📧 Verification email sent to ${userData.email}`);
    }

    return { 
      success: true, 
      message: "Account created successfully", 
      needsVerification: userData.userType !== "Guest" 
    };
  };

  const login = (email: string, password: string): { success: boolean; message: string; user?: User } => {
    const users = getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    // Save current user to localStorage
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    setCurrentUser(user);

    // Notify other components that auth state changed
    window.dispatchEvent(new Event('auth-changed'));

    return { success: true, message: "Login successful", user };
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
    
    // Notify other components that auth state changed
    window.dispatchEvent(new Event('auth-changed'));
  };

  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;

    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], ...updates };
      users[userIndex] = updatedUser;
      saveUsers(users);
      
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      // Notify other components that auth state changed
      window.dispatchEvent(new Event('auth-changed'));
    }
  };

  const getUserOrders = (): OrderHistory["orders"] => {
    if (!currentUser) return [];

    const ordersData = localStorage.getItem(ORDERS_KEY);
    const allOrders: OrderHistory[] = ordersData ? JSON.parse(ordersData) : [];
    
    const userOrders = allOrders.find(o => o.userId === currentUser.id);
    
    // Return empty array if no orders found
    if (!userOrders) {
      return [];
    }
    
    return userOrders.orders;
  };

  const addOrder = (order: OrderHistory["orders"][0]) => {
    if (!currentUser) {
      console.error("❌ Cannot add order: No current user");
      return;
    }

    console.log("📝 Adding order for user:", currentUser.id, order);

    const ordersData = localStorage.getItem(ORDERS_KEY);
    const allOrders: OrderHistory[] = ordersData ? JSON.parse(ordersData) : [];
    
    console.log("📦 Current orders data:", allOrders);
    
    const userOrdersIndex = allOrders.findIndex(o => o.userId === currentUser.id);
    
    if (userOrdersIndex !== -1) {
      allOrders[userOrdersIndex].orders.unshift(order);
      console.log("✅ Added order to existing user orders");
    } else {
      allOrders.push({
        userId: currentUser.id,
        orders: [order],
      });
      console.log("✅ Created new order history for user");
    }
    
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
    console.log("💾 Orders saved to localStorage");
  };

  const verifyEmail = (verificationCode: string): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: "No user logged in" };
    }

    // Simulated verification - in real app, would verify with backend
    if (verificationCode === "123456") {
      updateUser({ isVerified: true });
      return { success: true, message: "Email verified successfully" };
    }

    return { success: false, message: "Invalid verification code" };
  };

  const verifyCurrentPassword = (password: string): boolean => {
    if (!currentUser) return false;
    return currentUser.password === password;
  };

  const updatePassword = (currentPassword: string, newPassword: string): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: "No user logged in" };
    }

    // Verify current password
    if (!verifyCurrentPassword(currentPassword)) {
      return { success: false, message: "Current password is incorrect" };
    }

    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], password: newPassword };
      users[userIndex] = updatedUser;
      saveUsers(users);
      
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      return { success: true, message: "Password changed successfully" };
    }

    return { success: false, message: "Failed to update password" };
  };

  return {
    currentUser,
    signUp,
    login,
    logout,
    updateUser,
    getUserOrders,
    addOrder,
    verifyEmail,
    verifyCurrentPassword,
    updatePassword,
  };
}
