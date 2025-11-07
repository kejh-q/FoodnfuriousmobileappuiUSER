import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { NotificationProvider } from "./hooks/useNotification";
import { NotificationPopup } from "./components/NotificationPopup";
import { OnboardingGuide } from "./components/OnboardingGuide";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { HomePage } from "./components/HomePage";
import { CafeMenuPage } from "./components/CafeMenuPage";
import { BasketPage } from "./components/BasketPage";
import { FindingDriverPage } from "./components/FindingDriverPage";
import { LiveTrackingPage } from "./components/LiveTrackingPage";
import { OrderCompletePage } from "./components/OrderCompletePage";
import { LocationSelectionPage } from "./components/LocationSelectionPage";
import { ProfilePage } from "./components/ProfilePage";
import { OrderHistoryPage } from "./components/OrderHistoryPage";
import { PaymentMethodsPage } from "./components/PaymentMethodsPage";
import { NotificationsPage } from "./components/NotificationsPage";
import { HelpSupportPage } from "./components/HelpSupportPage";
import { ChangePasswordPage } from "./components/ChangePasswordPage";
import { SettingsPage } from "./components/SettingsPage";
import { AddressManagementPage } from "./components/AddressManagementPage";
import { FavoritesPage } from "./components/FavoritesPage";
import { PromoCodesPage } from "./components/PromoCodesPage";
import { CheckoutPage, type CheckoutData } from "./components/CheckoutPage";
import { PaymentPage } from "./components/PaymentPage";
import { useDarkMode } from "./hooks/useDarkMode";
import { useAuth } from "./hooks/useAuth";
import { useCart } from "./hooks/useCart";
import { useNotificationStore } from "./hooks/useNotificationStore";
import { useFavorites } from "./hooks/useFavorites";

type Page =
  | "login"
  | "signup"
  | "home"
  | "menu"
  | "basket"
  | "checkout"
  | "payment"
  | "finding-driver"
  | "tracking"
  | "complete"
  | "location"
  | "profile"
  | "order-history"
  | "payment-methods"
  | "notifications"
  | "help-support"
  | "change-password"
  | "settings"
  | "addresses"
  | "favorites"
  | "promo-codes";

const ONBOARDING_KEY = "um_eats_onboarding_completed_";

export default function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [deliveryLocation, setDeliveryLocation] = useState("Kolej Kediaman 12");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedCafeId, setSelectedCafeId] = useState<number | null>(null);
  const [checkoutCafe, setCheckoutCafe] = useState<string | undefined>(undefined);

  // Debug: Track when currentUser changes
  useEffect(() => {
    console.log("👤 Current User Changed:", {
      userId: currentUser?.id,
      userName: currentUser?.name,
      userEmail: currentUser?.email,
    });
  }, [currentUser]);

  // Debug: Track showOnboarding state
  useEffect(() => {
    console.log("🎓 showOnboarding state changed:", showOnboarding);
  }, [showOnboarding]);

  // Cart management - tied to user
  const { 
    cartItems, 
    addToCart, 
    updateQuantity, 
    removeFromCart,
    clearCart,
    clearCafeItems,
    cartCount,
    cartTotal,
    getCafeItems,
    getCafes
  } = useCart(currentUser?.id);

  // Checkout data state
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  // Favorites management - tied to user
  const {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoriteItems,
    getFavoriteCafes,
  } = useFavorites(currentUser?.id);

  // Notification store - tied to user
  const {
    storedNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll: clearNotifications,
    unreadCount,
  } = useNotificationStore(currentUser?.id);

  // Check if user needs onboarding when they log in (only for first-time signup)
  useEffect(() => {
    console.log("🔍 Onboarding Effect Triggered:", {
      currentUser: currentUser?.id,
      currentPage,
      hasUser: !!currentUser,
    });

    if (!currentUser) {
      console.log("❌ Onboarding check skipped - no current user");
      return;
    }

    if (currentPage !== "home") {
      console.log("❌ Onboarding check skipped - not on home page, current page:", currentPage);
      return;
    }
    
    // Increased delay to ensure localStorage is fully synced after navigation
    const timer = setTimeout(() => {
      const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY + currentUser.id);
      const isFirstLogin = localStorage.getItem(`um_eats_first_login_${currentUser.id}`);
      
      console.log("📊 Onboarding Status Check:", {
        userId: currentUser.id,
        userName: currentUser.name,
        hasSeenOnboarding,
        isFirstLogin,
        onboardingKey: ONBOARDING_KEY + currentUser.id,
        firstLoginKey: `um_eats_first_login_${currentUser.id}`,
        allLocalStorageKeys: Object.keys(localStorage),
      });
      
      // Show onboarding only if this is the first login after signup
      if (!hasSeenOnboarding && isFirstLogin === "true") {
        console.log("✅ Showing onboarding guide!");
        setShowOnboarding(true);
        // Clear the first login flag after showing
        localStorage.removeItem(`um_eats_first_login_${currentUser.id}`);
      } else {
        console.log("⏭️ Skipping onboarding:", {
          reason: hasSeenOnboarding ? "Already seen onboarding" : isFirstLogin !== "true" ? "Not first login (no flag)" : "Unknown",
          hasSeenOnboarding,
          isFirstLogin,
        });
      }
    }, 300); // Increased delay to 300ms

    return () => clearTimeout(timer);
  }, [currentUser, currentPage]);

  const handleNavigate = (page: Page, data?: any) => {
    setCurrentPage(page);
    // Handle cafe selection for menu
    if (data?.cafeId !== undefined) {
      setSelectedCafeId(data.cafeId);
    }
    // Handle cafe selection for checkout
    if (data?.cafe !== undefined) {
      setCheckoutCafe(data.cafe);
    }
    // Legacy support for direct cafeId
    if (typeof data === "number") {
      setSelectedCafeId(data);
    }
  };

  const handleOnboardingComplete = () => {
    if (currentUser) {
      localStorage.setItem(ONBOARDING_KEY + currentUser.id, "true");
    }
    setShowOnboarding(false);
  };

  const handleSelectLocation = (location: string) => {
    setDeliveryLocation(location);
  };

  return (
    <NotificationProvider>
      <NotificationPopup />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center transition-colors duration-300">
        {/* Mobile Container */}
        <div className="w-full max-w-[430px] min-h-screen bg-white dark:bg-gray-900 shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentPage === "login" && (
            <LoginPage key="login" onNavigate={handleNavigate} />
          )}
          {currentPage === "signup" && (
            <SignUpPage key="signup" onNavigate={handleNavigate} />
          )}
          {currentPage === "home" && (
            <HomePage
              key="home"
              onNavigate={handleNavigate}
              cartCount={cartCount}
              deliveryLocation={deliveryLocation}
              unreadNotifications={unreadCount}
              isFavorite={isFavorite}
              addToFavorites={addToFavorites}
              removeFromFavorites={removeFromFavorites}
            />
          )}
          {currentPage === "menu" && (
            <CafeMenuPage
              key="menu"
              onNavigate={handleNavigate}
              onAddToCart={addToCart}
              cartCount={cartCount}
              cafeId={selectedCafeId}
              isFavorite={isFavorite}
              addToFavorites={addToFavorites}
              removeFromFavorites={removeFromFavorites}
            />
          )}
          {currentPage === "basket" && (
            <BasketPage
              key="basket"
              onNavigate={handleNavigate}
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
            />
          )}
          {currentPage === "checkout" && (
            <CheckoutPage
              key="checkout"
              onNavigate={handleNavigate}
              onProceed={(data) => {
                setCheckoutData(data);
                handleNavigate("payment");
              }}
              cartItems={cartItems}
              deliveryLocation={deliveryLocation}
              selectedCafe={checkoutCafe}
            />
          )}
          {currentPage === "payment" && (
            <PaymentPage
              key="payment"
              onNavigate={handleNavigate}
              onPaymentComplete={() => {
                // Add notification for order placed
                if (checkoutData) {
                  addNotification({
                    type: "order",
                    title: "Order Placed Successfully! 🎉",
                    message: `Your order from ${checkoutData.cafe} is being prepared. We'll notify you when a driver is assigned.`,
                    time: "Just now",
                    isRead: false,
                  });
                }
                handleNavigate("finding-driver");
              }}
              checkoutData={checkoutData}
            />
          )}
          {currentPage === "finding-driver" && (
            <FindingDriverPage key="finding-driver" onNavigate={handleNavigate} />
          )}
          {currentPage === "tracking" && (
            <LiveTrackingPage 
              key="tracking" 
              onNavigate={handleNavigate}
              checkoutData={checkoutData || undefined}
            />
          )}
          {currentPage === "complete" && (
            <OrderCompletePage 
              key="complete" 
              onNavigate={handleNavigate}
              checkoutData={checkoutData || undefined}
              clearCafeItems={clearCafeItems}
            />
          )}
          {currentPage === "location" && (
            <LocationSelectionPage
              key="location"
              onNavigate={handleNavigate}
              onSelectLocation={handleSelectLocation}
              currentLocation={deliveryLocation}
            />
          )}
          {currentPage === "profile" && (
            <ProfilePage 
              key="profile" 
              onNavigate={handleNavigate}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          )}
          {currentPage === "order-history" && (
            <OrderHistoryPage 
              key="order-history" 
              onNavigate={handleNavigate}
              addToCart={addToCart}
            />
          )}
          {currentPage === "payment-methods" && (
            <PaymentMethodsPage key="payment-methods" onNavigate={handleNavigate} />
          )}
          {currentPage === "notifications" && (
            <NotificationsPage 
              key="notifications" 
              onNavigate={handleNavigate}
              notifications={storedNotifications}
              markAsRead={markAsRead}
              markAllAsRead={markAllAsRead}
              clearAll={clearNotifications}
            />
          )}
          {currentPage === "help-support" && (
            <HelpSupportPage key="help-support" onNavigate={handleNavigate} />
          )}
          {currentPage === "change-password" && (
            <ChangePasswordPage key="change-password" onNavigate={handleNavigate} />
          )}
          {currentPage === "settings" && (
            <SettingsPage key="settings" onNavigate={handleNavigate} />
          )}
          {currentPage === "addresses" && (
            <AddressManagementPage key="addresses" onNavigate={handleNavigate} />
          )}
          {currentPage === "promo-codes" && (
            <PromoCodesPage key="promo-codes" onNavigate={handleNavigate} />
          )}
          {currentPage === "favorites" && (
            <FavoritesPage 
              key="favorites" 
              onNavigate={handleNavigate}
              addToCart={addToCart}
              favorites={favorites}
              removeFromFavorites={removeFromFavorites}
              isFavorite={isFavorite}
            />
          )}
        </AnimatePresence>

        {/* Onboarding Guide */}
        <AnimatePresence>
          {showOnboarding && currentUser && (
            <OnboardingGuide
              key={`onboarding-${currentUser.id}`}
              onComplete={handleOnboardingComplete}
              userName={currentUser.name}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
    </NotificationProvider>
  );
}
