import React, { createContext, useReducer, useContext, useEffect } from "react";
import {
  showWarningToast,
  showErrorToast,
  showSuccessToast,
} from "../utils/toastUtils";

const ActionTypes = {
  TOGGLE_FAVOURITE: "TOGGLE_FAVOURITE",
  SET_FAVOURITES: "SET_FAVOURITES",
};

const FavouritesContext = createContext();
const LOCAL_STORAGE_FAVOURITES_KEY = "lws-ai-favourites";

const loadInitialState = () => {
  try {
    const savedFavourites = localStorage.getItem(LOCAL_STORAGE_FAVOURITES_KEY);
    if (savedFavourites) {
      const parsedFavourites = JSON.parse(savedFavourites);
      if (
        parsedFavourites &&
        typeof parsedFavourites === "object" &&
        !Array.isArray(parsedFavourites)
      ) {
        return { favourites: parsedFavourites };
      }
    }
  } catch (err) {
    showErrorToast(
      `Error loading favourites: ${err.message}. Favourites have been cleared.`,
    );
    localStorage.removeItem(LOCAL_STORAGE_FAVOURITES_KEY);
  }
  return { favourites: {} };
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.TOGGLE_FAVOURITE: {
      const image = action.payload;
      if (!image || typeof image.id === "undefined") {
        showWarningToast(
          "Could not toggle favourite: invalid image data received.",
        );
        return state;
      }

      const newFavourites = { ...state.favourites };
      const imageId = String(image.id);

      if (newFavourites[imageId]) {
        delete newFavourites[imageId];
        showSuccessToast("Removed from favourites!");
      } else {
        newFavourites[imageId] = image;
        showSuccessToast("Added to favourites!");
      }

      return { ...state, favourites: newFavourites };
    }

    case ActionTypes.SET_FAVOURITES:
      return {
        ...state,
        favourites:
          action.payload &&
          typeof action.payload === "object" &&
          !Array.isArray(action.payload)
            ? action.payload
            : {},
      };

    default:
      return state;
  }
};

export const FavouritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    if (state.favourites) {
      try {
        const favouritesToSave = {};
        Object.entries(state.favourites).forEach(([key, image]) => {
          const { displayUrl, ...rest } = image;
          favouritesToSave[key] = rest;
        });

        localStorage.setItem(
          LOCAL_STORAGE_FAVOURITES_KEY,
          JSON.stringify(favouritesToSave),
        );
      } catch (error) {
        showErrorToast(
          `Failed to save favourites to your browser: ${error.message}`,
        );
      }
    }
  }, [state.favourites]);
  return (
    <FavouritesContext.Provider value={{ state, dispatch }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (context === undefined) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }
  return context;
};
