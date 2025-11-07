import { useState, useEffect } from "react";

export interface FavoriteItem {
  id: string;
  name: string;
  cafe: string;
  price: number;
  image: string;
  type: "item";
}

export interface FavoriteCafe {
  id: number;
  name: string;
  type: string;
  rating: number;
  time: string;
  image: string;
  distance?: number;
  favoriteType: "cafe";
}

export type Favorite = FavoriteItem | FavoriteCafe;

const FAVORITES_KEY = "um_eats_favorites_";

export function useFavorites(userId?: string) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  // Load favorites from localStorage when userId changes
  useEffect(() => {
    if (userId) {
      const savedFavorites = localStorage.getItem(FAVORITES_KEY + userId);
      if (savedFavorites) {
        try {
          const parsed = JSON.parse(savedFavorites);
          setFavorites(parsed);
        } catch (error) {
          console.error("Error loading favorites:", error);
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [userId]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (userId && favorites) {
      localStorage.setItem(FAVORITES_KEY + userId, JSON.stringify(favorites));
    }
  }, [favorites, userId]);

  const addToFavorites = (item: Favorite) => {
    setFavorites((prev) => {
      // Check if item already exists
      const exists = prev.some((fav) => {
        if ("favoriteType" in item && "favoriteType" in fav) {
          return fav.id === item.id;
        }
        if ("type" in item && "type" in fav && item.type === "item" && fav.type === "item") {
          return fav.id === item.id;
        }
        return false;
      });

      if (exists) {
        return prev;
      }

      return [...prev, item];
    });
  };

  const removeFromFavorites = (itemId: string | number, itemType: "item" | "cafe") => {
    setFavorites((prev) =>
      prev.filter((fav) => {
        if (itemType === "cafe" && "favoriteType" in fav) {
          return fav.id !== itemId;
        }
        if (itemType === "item" && "type" in fav) {
          return fav.id !== itemId;
        }
        return true;
      })
    );
  };

  const isFavorite = (itemId: string | number, itemType: "item" | "cafe"): boolean => {
    return favorites.some((fav) => {
      if (itemType === "cafe" && "favoriteType" in fav) {
        return fav.id === itemId;
      }
      if (itemType === "item" && "type" in fav) {
        return fav.id === itemId;
      }
      return false;
    });
  };

  const getFavoriteItems = (): FavoriteItem[] => {
    return favorites.filter((fav): fav is FavoriteItem => "type" in fav && fav.type === "item");
  };

  const getFavoriteCafes = (): FavoriteCafe[] => {
    return favorites.filter((fav): fav is FavoriteCafe => "favoriteType" in fav);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoriteItems,
    getFavoriteCafes,
  };
}
