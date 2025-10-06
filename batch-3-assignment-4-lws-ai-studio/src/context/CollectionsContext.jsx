import React, { createContext, useContext, useReducer, useEffect } from "react";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

const CollectionsContext = createContext();
const LOCAL_STORAGE_COLLECTIONS_KEY = "lws-ai-collections";

const ActionTypes = {
  CREATE_COLLECTION: "CREATE_COLLECTION",
  DELETE_COLLECTION: "DELETE_COLLECTION",
  ADD_IMAGE_TO_COLLECTION: "ADD_IMAGE_TO_COLLECTION",
  REMOVE_IMAGE_FROM_COLLECTION: "REMOVE_IMAGE_FROM_COLLECTION",
};

const loadInitialState = () => {
  try {
    const savedCollections = localStorage.getItem(
      LOCAL_STORAGE_COLLECTIONS_KEY,
    );
    if (savedCollections) {
      return { collections: JSON.parse(savedCollections) };
    }
  } catch (err) {
    showErrorToast(`Error loading collections: ${err.message}`);
    localStorage.removeItem(LOCAL_STORAGE_COLLECTIONS_KEY);
  }
  return { collections: {} };
};

const collectionsReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_COLLECTION: {
      const { id, name } = action.payload;
      if (state.collections[id]) {
        showErrorToast("A collection with this ID already exists.");
        return state;
      }
      showSuccessToast(`Collection '${name}' created!`);
      return {
        ...state,
        collections: {
          ...state.collections,
          [id]: { id, name, images: [] },
        },
      };
    }

    case ActionTypes.DELETE_COLLECTION: {
      const collectionId = action.payload;
      const { [collectionId]: deleted, ...remaining } = state.collections;
      showSuccessToast(`Collection '${deleted.name}' deleted.`);
      return {
        ...state,
        collections: remaining,
      };
    }

    case ActionTypes.ADD_IMAGE_TO_COLLECTION: {
      const { collectionId, image } = action.payload;
      const collection = state.collections[collectionId];
      if (!collection) {
        showErrorToast("Collection not found.");
        return state;
      }
      const imageExists = collection.images.some((img) => img.id === image.id);
      if (imageExists) {
        showSuccessToast(`Image is already in '${collection.name}'.`);
        return state;
      }
      const updatedCollection = {
        ...collection,
        images: [image, ...collection.images],
      };
      showSuccessToast(`Image added to '${collection.name}'!`);
      return {
        ...state,
        collections: {
          ...state.collections,
          [collectionId]: updatedCollection,
        },
      };
    }

    case ActionTypes.REMOVE_IMAGE_FROM_COLLECTION: {
      const { collectionId, imageId } = action.payload;
      const collection = state.collections[collectionId];
      if (!collection) {
        showErrorToast("Collection not found.");
        return state;
      }
      const updatedImages = collection.images.filter(
        (img) => img.id !== imageId,
      );
      const updatedCollection = { ...collection, images: updatedImages };
      showSuccessToast(`Image removed from '${collection.name}'.`);
      return {
        ...state,
        collections: {
          ...state.collections,
          [collectionId]: updatedCollection,
        },
      };
    }

    default:
      return state;
  }
};

export const CollectionsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    collectionsReducer,
    undefined,
    loadInitialState,
  );

  useEffect(() => {
    try {
      const collectionsToSave = {};
      Object.entries(state.collections).forEach(([key, collection]) => {
        const sanitizedImages = collection.images.map((image) => {
          const { displayUrl, ...rest } = image;
          return rest;
        });
        collectionsToSave[key] = { ...collection, images: sanitizedImages };
      });

      localStorage.setItem(
        LOCAL_STORAGE_COLLECTIONS_KEY,
        JSON.stringify(collectionsToSave),
      );
    } catch (error) {
      showErrorToast(`Failed to save collections: ${error.message}`);
    }
  }, [state.collections]);
  return (
    <CollectionsContext.Provider value={{ state, dispatch }}>
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (context === undefined) {
    throw new Error("useCollections must be used within a CollectionsProvider");
  }
  return context;
};
