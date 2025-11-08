import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, MessageCircle, ShoppingCart, User, Send, Bell, Heart, UtensilsCrossed } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { NotificationPopup } from "./NotificationPopup";
import type { FavoriteCafe, FavoriteItem } from "../hooks/useFavorites";

interface HomePageProps {
  onNavigate: (page: string, cafeId?: number) => void;
  cartCount: number;
  deliveryLocation: string;
  unreadNotifications?: number;
  isFavorite: (itemId: string | number, itemType: "item" | "cafe") => boolean;
  addToFavorites: (item: FavoriteCafe | FavoriteItem) => void;
  removeFromFavorites: (itemId: string | number, itemType: "item" | "cafe") => void;
}

// Distance data (in km) from different locations
const locationDistances: Record<string, Record<number, number>> = {
  "Kolej Kediaman 12": { 1: 2.5, 2: 3.2, 3: 0.5, 4: 1.8 },
  "Faculty of Engineering": { 1: 1.8, 2: 0.3, 3: 3.5, 4: 2.1 },
  "Faculty of Science": { 1: 1.5, 2: 2.0, 3: 3.8, 4: 1.9 },
  "Main Campus": { 1: 0.8, 2: 1.5, 3: 3.0, 4: 1.2 },
  "Faculty of Medicine": { 1: 3.5, 2: 3.8, 3: 4.2, 4: 3.0 },
};

// Calculate estimated time based on distance (3 km/h average + prep time)
const calculateDeliveryTime = (distance: number): string => {
  const prepTime = 10; // 10 min preparation
  const travelTime = Math.round((distance / 3) * 60); // Convert to minutes
  const totalMin = prepTime + travelTime;
  const maxMin = totalMin + 5;
  return `${totalMin}-${maxMin} min`;
};

const cafes = [
  {
    id: 1,
    name: "UM Central Café",
    type: "Western & Local",
    rating: 4.5,
    time: "15-20 min",
    image: "https://images.unsplash.com/photo-1609590981063-d495e2914ce4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwZm9vZHxlbnwxfHx8fDE3NjIyMTA4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 2,
    name: "Faculty of Engineering Cafeteria",
    type: "Malaysian Cuisine",
    rating: 4.3,
    time: "10-15 min",
    image: "https://images.unsplash.com/photo-1677921755291-c39158477b8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXNpJTIwbGVtYWt8ZW58MXx8fHwxNzYyMjIwNzYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 3,
    name: "KK12 Food Court",
    type: "Mixed Cuisine",
    rating: 4.7,
    time: "20-25 min",
    image: "https://images.unsplash.com/photo-1746003668321-d400319650ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHJlc3RhdXJhbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjIyNzcyNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 4,
    name: "Asia Café",
    type: "Asian Fusion",
    rating: 4.4,
    time: "15-20 min",
    image: "https://images.unsplash.com/photo-1569058242252-623df46b5025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwcmljZXxlbnwxfHx8fDE3NjIyNzcyNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  cafeId: number;
  cafeName: string;
}

// All food items from all cafes
// IMPORTANT: IDs must match the item IDs in CafeMenuPage for favorites to work correctly
const allFoodItems: FoodItem[] = [
  // UM Central Café
  { id: 1, name: "Nasi Lemak Special", description: "Coconut rice with fried chicken, sambal, and sides", price: 8.5, image: "https://images.unsplash.com/photo-1677921755291-c39158477b8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXNpJTIwbGVtYWt8ZW58MXx8fHwxNzYyMjIwNzYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 1, cafeName: "UM Central Café" },
  { id: 2, name: "Western Breakfast Set", description: "Scrambled eggs, toast, sausage, and hash brown", price: 9.5, image: "https://images.unsplash.com/photo-1609590981063-d495e2914ce4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwZm9vZHxlbnwxfHx8fDE3NjIyMTA4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 1, cafeName: "UM Central Café" },
  { id: 3, name: "Bubble Tea", description: "Classic milk tea with tapioca pearls", price: 6.0, image: "https://images.unsplash.com/photo-1558857563-b371033873b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWF8ZW58MXx8fHwxNzYyMjUyNDkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 1, cafeName: "UM Central Café" },
  { id: 4, name: "Club Sandwich", description: "Triple-decker with chicken, bacon, and veggies", price: 10.0, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaHxlbnwxfHx8fDE3NjI0NjUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 1, cafeName: "UM Central Café" },
  // Faculty of Engineering Cafeteria
  { id: 1, name: "Nasi Lemak Special", description: "Traditional coconut rice with all the fixings", price: 7.0, image: "https://images.unsplash.com/photo-1677921755291-c39158477b8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXNpJTIwbGVtYWt8ZW58MXx8fHwxNzYyMjIwNzYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 2, cafeName: "Faculty of Engineering Cafeteria" },
  { id: 2, name: "Mee Goreng", description: "Spicy fried noodles with vegetables and egg", price: 6.5, image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWUlMjBnb3Jlbmd8ZW58MXx8fHwxNzYyNDY1MDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 2, cafeName: "Faculty of Engineering Cafeteria" },
  { id: 3, name: "Roti Canai with Curry", description: "Crispy flatbread served with dhal curry", price: 5.0, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3RpJTIwY2FuYWl8ZW58MXx8fHwxNzYyNDY1MDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 2, cafeName: "Faculty of Engineering Cafeteria" },
  { id: 4, name: "Nasi Goreng Kampung", description: "Village-style fried rice with anchovies", price: 6.0, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHJpY2V8ZW58MXx8fHwxNzYyNDY1MDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 2, cafeName: "Faculty of Engineering Cafeteria" },
  // KK12 Food Court
  { id: 1, name: "Hainanese Chicken Rice", description: "Tender chicken with fragrant rice and chili sauce", price: 7.5, image: "https://images.unsplash.com/photo-1569058242252-623df46b5025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwcmljZXxlbnwxfHx8fDE3NjIyNzcyNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 3, cafeName: "KK12 Food Court" },
  { id: 2, name: "Char Kuey Teow", description: "Wok-fried flat rice noodles with prawns and egg", price: 8.0, image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub29kbGVzfGVufDF8fHx8MTc2MjQ2NTAwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 3, cafeName: "KK12 Food Court" },
  { id: 3, name: "Laksa", description: "Spicy coconut curry noodle soup", price: 7.0, image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtzYXxlbnwxfHx8fDE3NjI0NjUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 3, cafeName: "KK12 Food Court" },
  { id: 4, name: "Satay Combo", description: "Grilled meat skewers with peanut sauce", price: 9.0, image: "https://images.unsplash.com/photo-1529543544-76e6f1a6f79c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRheXxlbnwxfHx8fDE3NjI0NjUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 3, cafeName: "KK12 Food Court" },
  // Asia Café
  { id: 1, name: "Thai Basil Chicken", description: "Stir-fried chicken with holy basil and chilies", price: 8.5, image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwZm9vZHxlbnwxfHx8fDE3NjI0NjUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 4, cafeName: "Asia Café" },
  { id: 2, name: "Vietnamese Pho", description: "Beef noodle soup with fresh herbs", price: 9.0, image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtzYXxlbnwxfHx8fDE3NjI0NjUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 4, cafeName: "Asia Café" },
  { id: 3, name: "Korean Bibimbap", description: "Mixed rice bowl with vegetables and egg", price: 10.0, image: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWJpbWJhcHxlbnwxfHx8fDE3NjI0NjUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 4, cafeName: "Asia Café" },
  { id: 4, name: "Japanese Ramen", description: "Rich pork broth with fresh noodles and toppings", price: 11.0, image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYW1lbnxlbnwxfHx8fDE3NjI0NjUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", cafeId: 4, cafeName: "Asia Café" },
];

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

export function HomePage({ 
  onNavigate, 
  cartCount, 
  deliveryLocation, 
  unreadNotifications = 0,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
}: HomePageProps) {
  const { currentUser } = useAuth();
  const [showChatbot, setShowChatbot] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help you find the perfect meal. What are you craving today?",
      isBot: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Get distance data for current location
  const distances = locationDistances[deliveryLocation] || locationDistances["Kolej Kediaman 12"];

  // Scroll to top when component mounts
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, []);

  // Add calculated delivery times and distances to cafes
  const cafesWithTimes = cafes.map(cafe => ({
    ...cafe,
    distance: distances[cafe.id] || 2.0,
    time: calculateDeliveryTime(distances[cafe.id] || 2.0),
  }));

  // Filter cafes
  const filteredCafes = cafesWithTimes.filter(
    (cafe) => {
      const matchesSearch = 
        cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFavorite = showFavoritesOnly ? isFavorite(cafe.id, "cafe") : true;
      
      return matchesSearch && matchesFavorite;
    }
  );

  // Filter food items
  const filteredFoodItems = allFoodItems.filter((item) => {
    // Generate a unique ID for the food item that matches the format used in CafeMenuPage
    const itemId = `cafe-${item.cafeId}-item-${item.id}`;
    
    // When showing favorites only
    if (showFavoritesOnly && !searchQuery) {
      return isFavorite(itemId, "item");
    }
    
    // When searching
    if (searchQuery) {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cafeName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFavorite = showFavoritesOnly ? isFavorite(itemId, "item") : true;
      
      return matchesSearch && matchesFavorite;
    }
    
    // Don't show food items by default (only when searching or showing favorites)
    return false;
  });

  const handleToggleFavorite = (e: React.MouseEvent, cafe: typeof cafesWithTimes[0]) => {
    e.stopPropagation();
    const isFav = isFavorite(cafe.id, "cafe");
    if (isFav) {
      removeFromFavorites(cafe.id, "cafe");
    } else {
      addToFavorites({
        ...cafe,
        favoriteType: "cafe",
      });
    }
  };

  const handleToggleFoodFavorite = (e: React.MouseEvent, item: FoodItem) => {
    e.stopPropagation();
    const itemId = `cafe-${item.cafeId}-item-${item.id}`;
    const isFav = isFavorite(itemId, "item");
    
    if (isFav) {
      removeFromFavorites(itemId, "item");
    } else {
      addToFavorites({
        id: itemId,
        name: item.name,
        cafe: item.cafeName,
        price: item.price,
        image: item.image,
        type: "item",
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");

    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        isBot: true,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Greetings
    if (lowerQuery.match(/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/)) {
      return "Hello! 👋 I'm here to help you find the perfect meal. Are you looking for a specific cuisine or do you want me to suggest something?";
    }
    
    // Malaysian/Local food
    if (lowerQuery.match(/\b(nasi lemak|nasi|rendang|satay|malay|malaysian|local)\b/)) {
      return "Great choice! I recommend the Faculty of Engineering Cafeteria. They serve amazing Nasi Lemak Special for RM 8.50. It's only 10-15 minutes away! 🍛";
    }
    
    // Western food
    if (lowerQuery.match(/\b(western|breakfast|egg|toast|sausage|burger|pasta)\b/)) {
      return "For Western food, UM Central Café is perfect! They have a delicious Western Breakfast Set (RM 9.50) with scrambled eggs, toast, and sausage. Should I show you their menu? 🍳";
    }
    
    // Asian/Chinese food
    if (lowerQuery.match(/\b(chicken rice|asian|chinese|rice|noodle)\b/)) {
      return "Asia Café has excellent Hainanese Chicken Rice for RM 7.50! They have a 4.4⭐ rating and deliver in 15-20 minutes. Want to order from there? 🍗";
    }
    
    // Drinks/Beverages
    if (lowerQuery.match(/\b(drink|bubble tea|coffee|tea|boba)\b/)) {
      return "All our cafés serve drinks! For the best bubble tea, I'd recommend KK12 Food Court - they have a great selection at RM 6.00. Would you like to see their menu? 🧋";
    }
    
    // Fast/Quick delivery
    if (lowerQuery.match(/\b(quick|fast|nearest|close|urgent|hurry)\b/)) {
      return "The Faculty of Engineering Cafeteria is nearest to you with only 10-15 min delivery time! They serve delicious Malaysian cuisine. Would you like to order from there? ⚡";
    }
    
    // Best rated
    if (lowerQuery.match(/\b(best|top|highest|rating|popular|recommend|suggest)\b/)) {
      return "Based on ratings and your location at Kolej Kediaman 12, I highly recommend KK12 Food Court! It has the highest rating at 4.7⭐ with mixed cuisine options. Want to check it out? 🌟";
    }
    
    // Cheap/Budget
    if (lowerQuery.match(/\b(cheap|budget|affordable|price|expensive)\b/)) {
      return "For budget-friendly options, Asia Café has great meals starting from RM 7.50! Their Chicken Rice is especially popular and affordable. 💰";
    }
    
    // Thanks
    if (lowerQuery.match(/\b(thank|thanks|thx)\b/)) {
      return "You're welcome! Feel free to ask if you need any other recommendations. Happy eating! 😊";
    }
    
    // Help/What can you do
    if (lowerQuery.match(/\b(help|what can you|how|guide)\b/)) {
      return "I can help you find cafés based on:\n• Cuisine type (Malaysian, Western, Asian)\n• Delivery time\n• Ratings & reviews\n• Budget\n\nWhat would you like to know?";
    }
    
    // Default response
    return "I can help you find the perfect meal! Try asking me about:\n• Specific foods (nasi lemak, chicken rice, etc.)\n• Fast delivery options\n• Best-rated cafés\n• Budget-friendly meals\n\nWhat are you craving? 🍴";
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      {/* Notification Popup */}
      <NotificationPopup onNavigateToNotifications={() => onNavigate("notifications")} />

      {/* Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-[#FFD60A] dark:bg-yellow-600 shadow-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo and Location */}
            <div className="flex items-center gap-8">
              <h1 className="text-gray-900 dark:text-white whitespace-nowrap">Food n Furious</h1>
              <button
                onClick={() => onNavigate("location")}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <MapPin className="w-5 h-5 text-gray-900 dark:text-white" />
                <div className="text-left hidden md:block">
                  <p className="text-xs text-gray-700 dark:text-gray-300">Deliver to</p>
                  <p className="text-gray-900 dark:text-white">{deliveryLocation}</p>
                </div>
                <span className="md:hidden text-gray-900 dark:text-white">{deliveryLocation}</span>
              </button>
            </div>

            {/* Search Bar - Center */}
            <div className="flex-1 max-w-2xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search for food or cafés"
                className="h-12 pl-12 pr-4 rounded-xl border-0 bg-white dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate("notifications")}
                className="relative w-10 h-10 hover:bg-white/20 dark:hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-900 dark:text-white" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <button
                onClick={() => onNavigate("basket")}
                className="relative w-10 h-10 hover:bg-white/20 dark:hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-900 dark:text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => onNavigate("profile")}
                className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                {currentUser?.avatar || <User className="w-5 h-5 text-gray-900 dark:text-white" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900 dark:text-white">
            {searchQuery ? "Search Results" : showFavoritesOnly ? "My Favourites" : "Popular Cafés"}
          </h2>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              showFavoritesOnly
                ? "bg-[#FFD60A] dark:bg-yellow-600 text-gray-900 dark:text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            <Heart 
              className={`w-4 h-4 ${
                showFavoritesOnly 
                  ? "fill-gray-900 dark:fill-white text-gray-900 dark:text-white" 
                  : ""
              }`} 
            />
            <span className="text-sm">Favourites</span>
          </button>
        </div>

        {filteredCafes.length === 0 && filteredFoodItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {showFavoritesOnly ? "No favourites yet" : searchQuery ? "No results found" : "No cafés found"}
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              {showFavoritesOnly 
                ? "Add cafés and food items to your favourites by clicking the heart icon" 
                : "Try searching for something else"}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Food Items Search Results */}
            {filteredFoodItems.length > 0 && (
              <div>
                <h3 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5" />
                  Food Items ({filteredFoodItems.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFoodItems.map((item, index) => (
                    <motion.div
                      key={`food-${item.cafeId}-${item.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-[#FFD60A] dark:hover:border-yellow-600 overflow-hidden transition-all hover:shadow-lg relative"
                    >
                      <div 
                        onClick={() => onNavigate("menu", item.cafeId)}
                        className="flex gap-3 p-3 cursor-pointer"
                      >
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-gray-900 dark:text-white mb-1 line-clamp-1 flex-1">{item.name}</h4>
                            <button
                              onClick={(e) => handleToggleFoodFavorite(e, item)}
                              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  isFavorite(`cafe-${item.cafeId}-item-${item.id}`, "item")
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-400"
                                }`}
                              />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.cafeName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{item.description}</p>
                          <p className="text-gray-900 dark:text-white">RM {item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Cafés */}
            {filteredCafes.length > 0 && (
              <div>
                {filteredFoodItems.length > 0 && (
                  <h3 className="text-gray-900 dark:text-white mb-4">Cafés ({filteredCafes.length})</h3>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCafes.map((cafe, index) => (
              <motion.div
                key={cafe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  onClick={() => onNavigate("menu", cafe.id)}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-700 hover:border-[#FFD60A] dark:hover:border-yellow-600 hover:shadow-lg transition-all cursor-pointer h-full"
                >
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={cafe.image}
                      alt={cafe.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => handleToggleFavorite(e, cafe)}
                      className="absolute top-3 right-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isFavorite(cafe.id, "cafe")
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300">
                      📍 {cafe.distance.toFixed(1)} km
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-gray-900 dark:text-white mb-1">{cafe.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{cafe.type}</p>
                    <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                      <span>⭐ {cafe.rating}</span>
                      <span>• {cafe.time}</span>
                    </div>
                  </div>
                </div>
                  </motion.div>
                ))}
              </div>
            </div>
            )}
          </div>
        )}
      </div>

      {/* AI Chatbot Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#FFD60A] dark:bg-yellow-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-50"
      >
        <MessageCircle className="w-7 h-7 text-gray-900 dark:text-white" />
      </motion.button>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-28 right-8 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden z-40 transition-colors duration-300"
          >
            <div className="bg-[#FFD60A] dark:bg-yellow-600 p-4 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900 dark:text-white">AI Assistant</h3>
                <button
                  onClick={() => setShowChatbot(false)}
                  className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4 h-64 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 ${message.isBot ? "" : "flex justify-end"}`}
                >
                  <div
                    className={`rounded-xl p-3 max-w-[85%] ${
                      message.isBot
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        : "bg-[#FFD60A] dark:bg-yellow-600 text-gray-900 dark:text-white"
                    }`}
                  >
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  className="rounded-xl flex-1 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <Button
                  type="submit"
                  className="bg-[#FFD60A] hover:bg-[#FFC700] dark:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl px-4"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
