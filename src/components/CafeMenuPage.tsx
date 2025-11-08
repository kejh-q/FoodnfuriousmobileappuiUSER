import { motion } from "motion/react";
import { ArrowLeft, ShoppingCart, Plus, Heart, Minus, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNotification } from "../hooks/useNotification";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import type { CartItem } from "../hooks/useCart";
import type { FavoriteItem } from "../hooks/useFavorites";

interface CafeMenuPageProps {
  onNavigate: (page: string) => void;
  onAddToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  cartCount: number;
  cafeId: number | null;
  isFavorite: (itemId: string | number, itemType: "item" | "cafe") => boolean;
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (itemId: string | number, itemType: "item" | "cafe") => void;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  allergens?: string[];
}

interface CafeInfo {
  id: number;
  name: string;
  type: string;
  time: string;
}

const cafeData: Record<number, CafeInfo> = {
  1: {
    id: 1,
    name: "UM Central Café",
    type: "Western & Local",
    time: "15-20 min",
  },
  2: {
    id: 2,
    name: "Faculty of Engineering Cafeteria",
    type: "Malaysian Cuisine",
    time: "10-15 min",
  },
  3: {
    id: 3,
    name: "KK12 Food Court",
    type: "Mixed Cuisine",
    time: "20-25 min",
  },
  4: {
    id: 4,
    name: "Asia Café",
    type: "Asian Fusion",
    time: "15-20 min",
  },
};

const cafeMenus: Record<number, MenuItem[]> = {
  1: [ // UM Central Café - Western & Local
    {
      id: 1,
      name: "Nasi Lemak Special",
      description: "Coconut rice with fried chicken, sambal, and sides",
      price: 8.5,
      image: "https://images.unsplash.com/photo-1677921755291-c39158477b8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXNpJTIwbGVtYWt8ZW58MXx8fHwxNzYyMjIwNzYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Peanuts", "Fish"],
    },
    {
      id: 2,
      name: "Western Breakfast Set",
      description: "Scrambled eggs, toast, sausage, and hash brown",
      price: 9.5,
      image: "https://images.unsplash.com/photo-1609590981063-d495e2914ce4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwZm9vZHxlbnwxfHx8fDE3NjIyMTA4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Eggs", "Wheat/Gluten", "Milk"],
    },
    {
      id: 3,
      name: "Bubble Tea",
      description: "Classic milk tea with tapioca pearls",
      price: 6.0,
      image: "https://images.unsplash.com/photo-1558857563-b371033873b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWF8ZW58MXx8fHwxNzYyMjUyNDkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Milk"],
    },
    {
      id: 4,
      name: "Club Sandwich",
      description: "Triple-decker with chicken, bacon, and veggies",
      price: 10.0,
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaHxlbnwxfHx8fDE3NjI0NjUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Wheat/Gluten", "Eggs"],
    },
  ],
  2: [ // Faculty of Engineering Cafeteria - Malaysian Cuisine
    {
      id: 1,
      name: "Nasi Lemak Special",
      description: "Traditional coconut rice with all the fixings",
      price: 7.0,
      image: "https://images.unsplash.com/photo-1677921755291-c39158477b8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXNpJTIwbGVtYWt8ZW58MXx8fHwxNzYyMjIwNzYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Peanuts", "Fish"],
    },
    {
      id: 2,
      name: "Mee Goreng",
      description: "Spicy fried noodles with vegetables and egg",
      price: 6.5,
      image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWUlMjBnb3Jlbmd8ZW58MXx8fHwxNzYyNDY1MDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Wheat/Gluten", "Eggs", "Soy"],
    },
    {
      id: 3,
      name: "Roti Canai with Curry",
      description: "Crispy flatbread served with dhal curry",
      price: 5.0,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3RpJTIwY2FuYWl8ZW58MXx8fHwxNzYyNDY1MDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Wheat/Gluten", "Milk"],
    },
    {
      id: 4,
      name: "Nasi Goreng Kampung",
      description: "Village-style fried rice with anchovies",
      price: 6.0,
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHJpY2V8ZW58MXx8fHwxNzYyNDY1MDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Fish", "Shellfish"],
    },
  ],
  3: [ // KK12 Food Court - Mixed Cuisine
    {
      id: 1,
      name: "Hainanese Chicken Rice",
      description: "Tender chicken with fragrant rice and chili sauce",
      price: 7.5,
      image: "https://images.unsplash.com/photo-1569058242252-623df46b5025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwcmljZXxlbnwxfHx8fDE3NjIyNzcyNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Soy"],
    },
    {
      id: 2,
      name: "Char Kuey Teow",
      description: "Wok-fried flat rice noodles with prawns and egg",
      price: 8.0,
      image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub29kbGVzfGVufDF8fHx8MTc2MjQ2NTAwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Shellfish", "Eggs", "Soy"],
    },
    {
      id: 3,
      name: "Laksa",
      description: "Spicy coconut curry noodle soup",
      price: 7.0,
      image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtzYXxlbnwxfHx8fDE3NjI0NjUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Shellfish", "Fish"],
    },
    {
      id: 4,
      name: "Satay Combo",
      description: "Grilled meat skewers with peanut sauce",
      price: 9.0,
      image: "https://images.unsplash.com/photo-1529543544-76e6f1a6f79c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRheXxlbnwxfHx8fDE3NjI0NjUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Peanuts"],
    },
  ],
  4: [ // Asia Café - Asian Fusion
    {
      id: 1,
      name: "Thai Basil Chicken",
      description: "Stir-fried chicken with holy basil and chilies",
      price: 8.5,
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwZm9vZHxlbnwxfHx8fDE3NjI0NjUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Soy"],
    },
    {
      id: 2,
      name: "Vietnamese Pho",
      description: "Beef noodle soup with fresh herbs",
      price: 9.0,
      image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtzYXxlbnwxfHx8fDE3NjI0NjUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Wheat/Gluten", "Soy"],
    },
    {
      id: 3,
      name: "Korean Bibimbap",
      description: "Mixed rice bowl with vegetables and egg",
      price: 10.0,
      image: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWJpbWJhcHxlbnwxfHx8fDE3NjI0NjUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Eggs", "Soy"],
    },
    {
      id: 4,
      name: "Japanese Ramen",
      description: "Rich pork broth with fresh noodles and toppings",
      price: 11.0,
      image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYW1lbnxlbnwxfHx8fDE3NjI0NjUwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      allergens: ["Wheat/Gluten", "Eggs", "Soy"],
    },
  ],
};

export function CafeMenuPage({ 
  onNavigate, 
  onAddToCart, 
  cartCount, 
  cafeId,
  isFavorite,
  addToFavorites,
  removeFromFavorites
}: CafeMenuPageProps) {
  const { showNotification } = useNotification();
  const { currentUser } = useAuth();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [showAllergyWarning, setShowAllergyWarning] = useState(false);
  const [allergyWarningItem, setAllergyWarningItem] = useState<MenuItem | null>(null);
  const [conflictingAllergens, setConflictingAllergens] = useState<string[]>([]);

  // Get cafe info and menu items based on cafeId
  const cafe = cafeId ? cafeData[cafeId] : cafeData[1];
  const menuItems = cafeId ? (cafeMenus[cafeId] || cafeMenus[1]) : cafeMenus[1];

  const checkAllergyConflict = (item: MenuItem): { hasConflict: boolean; allergens: string[] } => {
    if (!currentUser?.allergies || !item.allergens) {
      return { hasConflict: false, allergens: [] };
    }

    const conflicts = item.allergens.filter(allergen => 
      currentUser.allergies?.some(userAllergy => 
        userAllergy.toLowerCase() === allergen.toLowerCase()
      )
    );

    return { hasConflict: conflicts.length > 0, allergens: conflicts };
  };

  const handleAddToCart = (item: MenuItem, qty: number = 1, itemNotes: string = "") => {
    onAddToCart({
      id: `cafe-${cafe.id}-item-${item.id}`,
      name: item.name,
      price: item.price,
      image: item.image,
      cafe: cafe.name,
      notes: itemNotes || undefined,
    }, qty);
    showNotification("success", `${qty}x ${item.name} added to cart!`);
  };

  const handleItemClick = (item: MenuItem) => {
    const allergyCheck = checkAllergyConflict(item);
    
    if (allergyCheck.hasConflict) {
      setAllergyWarningItem(item);
      setConflictingAllergens(allergyCheck.allergens);
      setShowAllergyWarning(true);
    } else {
      setSelectedItem(item);
      setQuantity(1);
      setShowQuantityDialog(true);
    }
  };

  const handleConfirmAllergy = () => {
    if (allergyWarningItem) {
      setShowAllergyWarning(false);
      setSelectedItem(allergyWarningItem);
      setQuantity(1);
      setShowQuantityDialog(true);
      setAllergyWarningItem(null);
      setConflictingAllergens([]);
    }
  };

  const handleCancelAllergy = () => {
    setShowAllergyWarning(false);
    setAllergyWarningItem(null);
    setConflictingAllergens([]);
  };

  const handleConfirmQuantity = () => {
    if (selectedItem) {
      handleAddToCart(selectedItem, quantity, notes);
      setShowQuantityDialog(false);
      setSelectedItem(null);
      setQuantity(1);
      setNotes("");
    }
  };

  const handleToggleFavorite = (item: MenuItem) => {
    const itemId = `cafe-${cafe.id}-item-${item.id}`;
    const isFav = isFavorite(itemId, "item");
    
    if (isFav) {
      removeFromFavorites(itemId, "item");
      showNotification("info", "Removed from favorites");
    } else {
      addToFavorites({
        id: itemId,
        name: item.name,
        cafe: cafe.name,
        price: item.price,
        image: item.image,
        type: "item",
      });
      showNotification("success", "Added to favorites");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      {/* Header */}
      <div className="bg-[#FFD60A] dark:bg-yellow-600 shadow-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="hidden md:inline">Back to Home</span>
            </button>
            <button
              onClick={() => onNavigate("basket")}
              className="relative w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              <ShoppingCart className="w-6 h-6 text-gray-900 dark:text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </button>
          </div>
          <div className="mt-4">
            <h1 className="text-gray-900 dark:text-white mb-1">{cafe.name}</h1>
            <p className="text-gray-700 dark:text-gray-200">{cafe.type} • {cafe.time}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-gray-900 dark:text-white mb-6">Menu</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300"
            >
              <div className="flex gap-4 p-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-gray-900 dark:text-white">{item.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(item);
                      }}
                      className="flex-shrink-0"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isFavorite(`cafe-${cafe.id}-item-${item.id}`, "item")
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{item.description}</p>
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.allergens.map((allergen) => {
                        const hasConflict = currentUser?.allergies?.some(
                          (userAllergy) => userAllergy.toLowerCase() === allergen.toLowerCase()
                        );
                        return (
                          <span
                            key={allergen}
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              hasConflict
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {allergen}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white">RM {item.price.toFixed(2)}</span>
                    <Button
                      onClick={() => handleItemClick(item)}
                      className="bg-[#FFD60A] dark:bg-yellow-600 hover:bg-[#FFC700] dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-full h-10 px-4 transition-colors"
                    >
                      <Plus className="w-5 h-5 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quantity Selection Dialog */}
      <Dialog open={showQuantityDialog} onOpenChange={setShowQuantityDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Quantity</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 dark:text-white mb-1">{selectedItem.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">RM {selectedItem.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5" />
                </Button>
                <span className="text-gray-900 dark:text-white min-w-[3rem] text-center">{quantity}</span>
                <Button
                  onClick={() => setQuantity(quantity + 1)}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-1">Total</p>
                <p className="text-gray-900 dark:text-white">RM {(selectedItem.price * quantity).toFixed(2)}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-900 dark:text-white">Special Instructions (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="e.g., No spicy, extra sauce, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-between gap-2 mt-4">
            <Button
              onClick={() => {
                setShowQuantityDialog(false);
                setSelectedItem(null);
                setQuantity(1);
                setNotes("");
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmQuantity}
              className="flex-1 bg-[#FFD60A] dark:bg-yellow-600 hover:bg-[#FFC700] dark:hover:bg-yellow-700 text-gray-900 dark:text-white"
            >
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allergy Warning Dialog */}
      <AlertDialog open={showAllergyWarning} onOpenChange={setShowAllergyWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <AlertTriangle className="w-6 h-6" />
              Allergy Warning
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p className="text-gray-900 dark:text-white">
                  This item contains ingredients you may be allergic to:
                </p>
                <div className="flex flex-wrap gap-2">
                  {conflictingAllergens.map((allergen) => (
                    <span
                      key={allergen}
                      className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to add this item to your cart?
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelAllergy}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAllergy}
              className="bg-[#FFD60A] dark:bg-yellow-600 hover:bg-[#FFC700] dark:hover:bg-yellow-700 text-gray-900 dark:text-white"
            >
              Add Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
