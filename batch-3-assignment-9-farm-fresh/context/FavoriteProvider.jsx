"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getFavorite } from "@/actions/favoriteAction";
import { useSession } from "next-auth/react";

const FavoriteContext = createContext(null);

const FavoriteProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const allFav = async () => {
      if (session) {
        const fav = await getFavorite(session.user.id);
        setFavorites(fav?.products);
      }
    };
    allFav();
  }, [session]);

  const addToFav = (product) => {
    setFavorites((prev) => [...prev, product]);
  };

  const removeFromFav = (productId) => {
    setFavorites((prev) => prev.filter((item) => item !== productId));
  };

  const inFav = (productId) => {
    if (!productId) return false;
    return favorites?.includes(productId.toString());
  };

  return (
    <FavoriteContext.Provider
      value={{ favorites, addToFav, removeFromFav, inFav }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  return useContext(FavoriteContext);
};

export default FavoriteProvider;
