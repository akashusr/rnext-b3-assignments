import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { generateImageFromApi } from "../api/pollinationsAPI";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../utils/toastUtils";

const ActionTypes = {
  SET_PROMPT: "SET_PROMPT",
  SET_MODEL: "SET_MODEL",
  SET_DIMENSIONS: "SET_DIMENSIONS",
  SET_SEED: "SET_SEED",
  SET_NOLOGO: "SET_NOLOGO",
  SET_IMAGES: "SET_IMAGES",
  SET_IMAGE: "SET_IMAGE",
  FINISH_LOADING: "FINISH_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_HISTORY: "SET_HISTORY",
  ADD_TO_HISTORY: "ADD_TO_HISTORY",
  LOAD_SAVED_SETTINGS: "LOAD_SAVED_SETTINGS",
  SETTINGS_LOADED: "SETTINGS_LOADED",
};

const ImageGenerationContext = createContext();

const NUM_IMAGES_TO_GENERATE = 9;
const LOCAL_STORAGE_SETTINGS_KEY = "lws-ai-settings";
const LOCAL_STORAGE_IMAGES_KEY = "lws-ai-generated-data";
const LOCAL_STORAGE_HISTORY_KEY = "lws-ai-prompt-history";

const initialState = {
  prompt: "",
  images: [],
  promptHistory: [],
  model: "playground-v2.5",
  width: 1024,
  height: 1024,
  seed: "",
  noLogo: true,
  loading: false,
  error: null,
  settingsLoaded: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_PROMPT:
      return { ...state, prompt: action.payload };
    case ActionTypes.SET_MODEL:
      return { ...state, model: action.payload };
    case ActionTypes.SET_DIMENSIONS:
      return {
        ...state,
        width: action.payload.width,
        height: action.payload.height,
      };
    case ActionTypes.SET_SEED:
      return { ...state, seed: action.payload };
    case ActionTypes.SET_NOLOGO:
      return { ...state, noLogo: action.payload };
    case ActionTypes.SET_IMAGES:
      return { ...state, images: action.payload, loading: true, error: null };
    case ActionTypes.SET_IMAGE: {
      const { index, payload } = action;
      const updatedImages = [...state.images];
      updatedImages[index] = payload;
      return { ...state, images: updatedImages };
    }
    case ActionTypes.FINISH_LOADING:
      return { ...state, loading: false };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ActionTypes.SET_HISTORY:
      return { ...state, promptHistory: action.payload };
    case ActionTypes.ADD_TO_HISTORY: {
      const newEntry = action.payload;
      const updatedHistory = [
        newEntry,
        ...state.promptHistory.filter(
          (item) => item.prompt !== newEntry.prompt,
        ),
      ].slice(0, 20);
      return { ...state, promptHistory: updatedHistory };
    }
    case ActionTypes.LOAD_SAVED_SETTINGS:
      return { ...state, ...action.payload, settingsLoaded: true };
    case ActionTypes.SETTINGS_LOADED:
      return { ...state, settingsLoaded: true };
    default:
      return state;
  }
};

export const ImageGenerationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const blobUrlsRef = useRef([]);
  const generationIdRef = useRef(null);

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      blobUrlsRef.current = [];
    };
  }, []);

  useEffect(() => {
    try {
      const savedSettings = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY),
      );
      if (savedSettings) {
        dispatch({
          type: ActionTypes.LOAD_SAVED_SETTINGS,
          payload: savedSettings,
        });
      } else {
        dispatch({ type: ActionTypes.SETTINGS_LOADED });
      }
    } catch (err) {
      showErrorToast("Failed to load saved settings.");
      dispatch({ type: ActionTypes.SETTINGS_LOADED });
    }
  }, []);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedImageData = JSON.parse(
          localStorage.getItem(LOCAL_STORAGE_IMAGES_KEY),
        );
        if (
          savedImageData &&
          savedImageData.images &&
          Array.isArray(savedImageData.images)
        ) {
          const imagesWithoutDisplayUrl = savedImageData.images.map((img) => ({
            ...img,
            displayUrl: null,
          }));

          dispatch({
            type: ActionTypes.SET_IMAGES,
            payload: imagesWithoutDisplayUrl,
          });

          for (let i = 0; i < savedImageData.images.length; i++) {
            const img = savedImageData.images[i];
            if (!img.permanentUrl) continue;
            try {
              const res = await fetch(img.permanentUrl);
              if (!res.ok) continue;
              const blob = await res.blob();
              const blobUrl = URL.createObjectURL(blob);
              blobUrlsRef.current.push(blobUrl);
              dispatch({
                type: ActionTypes.SET_IMAGE,
                index: i,
                payload: { ...img, displayUrl: blobUrl },
              });
            } catch {
              // Gracefully ignore fetch errors for individual images
            }
          }
        }
      } catch (err) {
        showErrorToast("Failed to load saved image data.");
      }

      try {
        const savedHistory = JSON.parse(
          localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY),
        );
        if (savedHistory && Array.isArray(savedHistory)) {
          dispatch({ type: ActionTypes.SET_HISTORY, payload: savedHistory });
        }
      } catch (err) {
        showErrorToast("Failed to load prompt history.");
      }
    };
    loadSavedData();
  }, []);

  useEffect(() => {
    if (!state.settingsLoaded) {
      return;
    }
    const settingsToSave = {
      model: state.model,
      width: state.width,
      height: state.height,
      seed: state.seed,
      noLogo: state.noLogo,
    };
    localStorage.setItem(
      LOCAL_STORAGE_SETTINGS_KEY,
      JSON.stringify(settingsToSave),
    );
  }, [
    state.model,
    state.width,
    state.height,
    state.seed,
    state.noLogo,
    state.settingsLoaded,
  ]);

  useEffect(() => {
    if (state.images.length > 0) {
      const dataToSave = {
        prompt: state.prompt,
        images: state.images
          .filter((image) => image)
          .map(({ displayUrl, ...rest }) => rest),
      };
      localStorage.setItem(
        LOCAL_STORAGE_IMAGES_KEY,
        JSON.stringify(dataToSave),
      );
    }
  }, [state.prompt, state.images]);

  useEffect(() => {
    if (state.promptHistory.length > 0) {
      localStorage.setItem(
        LOCAL_STORAGE_HISTORY_KEY,
        JSON.stringify(state.promptHistory),
      );
    }
  }, [state.promptHistory]);

  const generateImages = useCallback(
    async (options = { iterate: true }) => {
      if (!state.prompt || !state.prompt.trim()) {
        showErrorToast("Please enter a prompt!");
        dispatch({ type: ActionTypes.FINISH_LOADING });
        return;
      }

      const currentGenerationId = Date.now();
      generationIdRef.current = currentGenerationId;

      dispatch({
        type: ActionTypes.SET_IMAGES,
        payload: Array(NUM_IMAGES_TO_GENERATE).fill({ status: "queued" }),
      });

      const baseSeed = state.seed
        ? parseInt(state.seed, 10)
        : Math.floor(Math.random() * 1000000000);

      const widthToSend = state.width || initialState.width;
      const heightToSend = state.height || initialState.height;

      let firstImageUrl = null;

      for (let i = 0; i < NUM_IMAGES_TO_GENERATE; i++) {
        if (generationIdRef.current !== currentGenerationId) {
          return;
        }

        dispatch({
          type: ActionTypes.SET_IMAGE,
          index: i,
          payload: { status: "loading" },
        });

        const currentSeed = options.iterate ? baseSeed + i : baseSeed;

        let imageResult = null;
        try {
          const apiResponse = await generateImageFromApi({
            prompt: state.prompt,
            model: state.model,
            width: widthToSend,
            height: heightToSend,
            seed: currentSeed,
            noLogo: state.noLogo,
          });

          if (apiResponse && apiResponse.displayUrl) {
            imageResult = {
              id: `${Date.now()}-${i}`,
              prompt: state.prompt,
              model: state.model,
              seed: currentSeed,
              width: widthToSend,
              height: heightToSend,
              displayUrl: apiResponse.displayUrl,
              permanentUrl: apiResponse.permanentUrl || apiResponse.displayUrl,
              status: "ready",
            };

            if (!firstImageUrl) firstImageUrl = apiResponse.displayUrl;
            blobUrlsRef.current.push(apiResponse.displayUrl);
          } else {
            imageResult = { status: "error" };
            showWarningToast("One of the images could not be generated.");
          }
        } catch {
          imageResult = { status: "error" };
          showWarningToast("Image generation failed for one item.");
        }

        if (generationIdRef.current !== currentGenerationId) {
          return;
        }

        dispatch({
          type: ActionTypes.SET_IMAGE,
          index: i,
          payload: imageResult,
        });
      }

      dispatch({ type: ActionTypes.FINISH_LOADING });

      if (firstImageUrl) {
        dispatch({
          type: ActionTypes.ADD_TO_HISTORY,
          payload: { prompt: state.prompt, imageUrl: firstImageUrl },
        });
        showSuccessToast("Prompt saved to history!");
      }
    },
    [
      state.prompt,
      state.model,
      state.width,
      state.height,
      state.seed,
      state.noLogo,
    ],
  );

  return (
    <ImageGenerationContext.Provider
      value={{ state, dispatch, generateImages }}
    >
      {children}
    </ImageGenerationContext.Provider>
  );
};

export const useImageGeneration = () => {
  const context = useContext(ImageGenerationContext);
  if (context === undefined) {
    throw new Error(
      "useImageGeneration must be used within an ImageGenerationProvider",
    );
  }
  return context;
};
