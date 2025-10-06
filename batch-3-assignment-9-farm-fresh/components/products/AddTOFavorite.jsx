"use client";
import { addToFavorite, removeFromFavorite } from "@/actions/favoriteAction";
import { useFavorite } from "@/context/FavoriteProvider";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useTransition } from "react";
import { useRouter } from "next/navigation";

const AddTOFavorite = ({ productId, userId }) => {
  const { addToFav, removeFromFav, inFav } = useFavorite();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isFav = inFav(productId);

  const handleAddToFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      router.push("/login");
      return;
    }
    startTransition(async () => {
      try {
        if (isFav) {
          removeFromFav(productId); // optimistic
          await removeFromFavorite(productId, userId);
        } else {
          addToFav(productId); // optimistic
          await addToFavorite(productId, userId);
        }
      } catch (err) {
        // On error refetch could be implemented; minimal silent fail
      }
    });
  };

  return (
    <button
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      disabled={isPending}
      className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
      onClick={handleAddToFavorite}
    >
      <FontAwesomeIcon
        icon={faHeart}
        className={`cursor-pointer ${
          isFav ? "text-red-500" : "text-gray-600 dark:text-gray-400"
        }`}
      />
    </button>
  );
};

export default AddTOFavorite;
