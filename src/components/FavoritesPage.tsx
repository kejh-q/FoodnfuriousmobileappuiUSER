import { motion } from "motion/react";
import { ArrowLeft, Heart, ShoppingCart, Store } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNotification } from "../hooks/useNotification";
import type { CartItem } from "../hooks/useCart";
import type { Favorite, FavoriteItem as FavItem, FavoriteCafe } from "../hooks/useFavorites";

interface FavoritesPageProps {
  onNavigate: (page: string) => void;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  favorites: Favorite[];
  removeFromFavorites: (itemId: string | number, itemType: "item" | "cafe") => void;
  isFavorite: (itemId: string | number, itemType: "item" | "cafe") => boolean;
}

export function FavoritesPage({ 
  onNavigate, 
  addToCart, 
  favorites,
  removeFromFavorites,
  isFavorite
}: FavoritesPageProps) {
  const { showNotification } = useNotification();

  // Separate items and cafes
  const favoriteItems = favorites.filter((fav): fav is FavItem => "type" in fav && fav.type === "item");
  const favoriteCafes = favorites.filter((fav): fav is FavoriteCafe => "favoriteType" in fav);

  const handleRemoveFavoriteItem = (id: string) => {
    removeFromFavorites(id, "item");
    showNotification("info", "Removed from favorites");
  };

  const handleRemoveFavoriteCafe = (id: number) => {
    removeFromFavorites(id, "cafe");
    showNotification("info", "Removed from favorites");
  };

  const handleAddToCart = (item: FavItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      cafe: item.cafe,
    });
    showNotification("success", `${item.name} added to cart!`);
  };

  const totalFavorites = favoriteItems.length + favoriteCafes.length;

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
          <h1 className="text-gray-900 dark:text-white">My Favorites</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-6">
        {totalFavorites === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No favorites yet</p>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Start adding items and cafés to your favorites
            </p>
            <Button
              onClick={() => onNavigate("home")}
              className="bg-[#FFD60A] hover:bg-[#FFC700] dark:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl"
            >
              Browse Cafés
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Favorite Cafés */}
            {favoriteCafes.length > 0 && (
              <div>
                <h2 className="text-gray-900 dark:text-white mb-3">Favorite Cafés</h2>
                <div className="space-y-3">
                  {favoriteCafes.map((cafe, index) => (
                    <motion.div
                      key={cafe.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300"
                    >
                      <button
                        onClick={() => onNavigate("menu", cafe.id)}
                        className="w-full"
                      >
                        <div className="relative h-32">
                          <ImageWithFallback
                            src={cafe.image}
                            alt={cafe.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFavoriteCafe(cafe.id);
                            }}
                            className="absolute top-3 right-3 w-9 h-9 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md"
                          >
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                          </button>
                          {cafe.distance && (
                            <div className="absolute bottom-3 left-3 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300">
                              📍 {cafe.distance.toFixed(1)} km
                            </div>
                          )}
                        </div>
                        <div className="p-4 text-left">
                          <h3 className="text-gray-900 dark:text-white mb-1">{cafe.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">{cafe.type}</p>
                          <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                            <span>⭐ {cafe.rating}</span>
                            <span>• {cafe.time}</span>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorite Items */}
            {favoriteItems.length > 0 && (
              <div>
                <h2 className="text-gray-900 dark:text-white mb-3">Favorite Items</h2>
                <div className="space-y-3">
                  {favoriteItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (favoriteCafes.length + index) * 0.05 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300"
                    >
                      <div className="flex gap-4 p-4">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-gray-900 dark:text-white truncate">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => handleRemoveFavoriteItem(item.id)}
                              className="flex-shrink-0"
                            >
                              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                            </button>
                          </div>

                          <p className="text-gray-500 dark:text-gray-400 mb-2">
                            {item.cafe}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-900 dark:text-white">
                              RM {item.price.toFixed(2)}
                            </span>

                            <Button
                              onClick={() => handleAddToCart(item)}
                              size="sm"
                              className="bg-[#FFD60A] hover:bg-[#FFC700] dark:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl h-9"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </Button>
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
    </motion.div>
  );
}
