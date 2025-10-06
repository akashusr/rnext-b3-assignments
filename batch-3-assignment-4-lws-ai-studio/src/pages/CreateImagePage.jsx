import React, { useState, useEffect, useCallback } from "react";
import PromptInput from "../components/PromptInput";
import AdvancedSettings from "../components/AdvancedSettings";
import ImageGrid from "../components/ImageGrid";
import PromptHistory from "../components/PromptHistory";
import ImageModal from "../components/ImageModal";
import CanvasEditorModal from "../components/CanvasEditorModal";
import ImageCompareModal from "../components/ImageCompareModal";
import { useImageGeneration } from "../context/ImageGenerationContext";
import { useDownloads } from "../context/DownloadsContext";
import { fetchAvailableModels } from "../api/pollinationsAPI";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../utils/toastUtils";

const CreateImagePage = () => {
  const { state, dispatch, generateImages } = useImageGeneration();
  const { dispatch: downloadDispatch } = useDownloads();

  const [availableModels, setAvailableModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);

  const [templatePrompts, setTemplatePrompts] = useState([]);
  const [usedTemplates, setUsedTemplates] = useState([]);
  const [aiPrompts, setAIPrompts] = useState([]);
  const [usedAIPrompts, setUsedAIPrompts] = useState([]);
  const [allPrompts, setAllPrompts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalImageIndex, setCurrentModalImageIndex] = useState(0);
  const [modalImages, setModalImages] = useState([]);

  const [editorImage, setEditorImage] = useState(null);
  const [comparisonImages, setComparisonImages] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    const readyImages = state.images.filter(
      (img) =>
        img && img.status === "ready" && (img.displayUrl || img.permanentUrl),
    );
    setModalImages(readyImages);
  }, [state.images]);

  useEffect(() => {
    if (!state.settingsLoaded) {
      return;
    }

    (async () => {
      setModelsLoading(true);
      try {
        const modelList = await fetchAvailableModels();
        setAvailableModels(modelList);
        const isCurrentModelAvailable = modelList.some(
          (m) => m.value === state.model,
        );
        if (!isCurrentModelAvailable && modelList.length > 0) {
          dispatch({
            type: "SET_MODEL",
            payload: modelList[0]?.value || "playground-v2.5",
          });
        } else if (!isCurrentModelAvailable && modelList.length === 0) {
          dispatch({ type: "SET_MODEL", payload: "playground-v2.5" });
        }
      } catch (err) {
        showErrorToast(String(err.message || "Failed to fetch models."));
        setAvailableModels([
          { value: "playground-v2.5", label: "Playground V2.5 (Fallback)" },
        ]);
        if (state.model !== "playground-v2.5") {
          dispatch({ type: "SET_MODEL", payload: "playground-v2.5" });
        }
      } finally {
        setModelsLoading(false);
      }
    })();
  }, [dispatch, state.model, state.settingsLoaded]);

  useEffect(() => {
    const fetchJsonData = async (url, setData, name) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        setData(data);
      } catch (error) {
        showErrorToast(`Failed to load ${name}.`);
      }
    };
    fetchJsonData("/prompts.json", setTemplatePrompts, "templates");
    fetchJsonData("/generated-prompts.json", setAIPrompts, "AI prompts");
  }, []);

  useEffect(() => {
    if (templatePrompts.length > 0 || aiPrompts.length > 0) {
      const combined = [...new Set([...templatePrompts, ...aiPrompts])];
      setAllPrompts(combined);
    }
  }, [templatePrompts, aiPrompts]);

  const handleSelectCompare = (img, selected) => {
    if (selected) {
      if (comparisonImages.length >= 2) {
        showWarningToast("You can only select up to 2 images for comparison.");
        return;
      }

      const hasSameSeed = comparisonImages.some((i) => i.seed === img.seed);
      if (hasSameSeed) {
        showWarningToast(
          `Comparison disabled: Both images have the same seed (${img.seed}).`,
        );
        setComparisonImages([]);
        return;
      }

      setComparisonImages((prev) => [...prev, img]);
    } else {
      setComparisonImages((prev) => prev.filter((i) => i.id !== img.id));
    }
  };

  const handlePromptChange = (e) => {
    const value = e.target.value;
    dispatch({ type: "SET_PROMPT", payload: value });

    if (value.trim() === "") {
      dispatch({ type: "SET_IMAGES", payload: [] });
      dispatch({ type: "FINISH_LOADING" });
    }
  };

  const handleRandomPromptSelection = (prompts, used, setUsed, type) => {
    if (prompts.length === 0) {
      showErrorToast(`${type} are not loaded yet.`);
      return;
    }
    let remaining = prompts.filter((p) => !used.includes(p));
    if (remaining.length === 0) {
      setUsed([]);
      remaining = prompts;
      showWarningToast(`All ${type} used. Resetting the list. Pick again!`);
      if (remaining.length === 0) {
        showErrorToast(`No ${type} available to select.`);
        return;
      }
    }
    const random = remaining[Math.floor(Math.random() * remaining.length)];
    setUsed((prev) => [...prev, random]);
    dispatch({ type: "SET_PROMPT", payload: random });
    showSuccessToast(
      `${
        type === "Templates" ? "Template" : "AI Prompt"
      } inserted: ${random.substring(0, 30)}...`,
    );
  };

  const handleTemplatesClick = () =>
    handleRandomPromptSelection(
      templatePrompts,
      usedTemplates,
      setUsedTemplates,
      "Templates",
    );

  const handleGeneratePromptsClick = () =>
    handleRandomPromptSelection(
      aiPrompts,
      usedAIPrompts,
      setUsedAIPrompts,
      "AI Prompts",
    );

  const handleDownload = useCallback(
    (image) => {
      if (!image || !image.permanentUrl) {
        showErrorToast("Cannot download: Image data is incomplete.");
        return;
      }
      const downloadPayload = {
        id: image.id || image.permanentUrl,
        permanentUrl: image.permanentUrl,
        displayUrl: image.displayUrl || image.permanentUrl,
        prompt: image.prompt || "Untitled",
        model: image.model || "Unknown",
        seed: image.seed || "N/A",
        width: image.width || 0,
        height: image.height || 0,
        status: image.status || "ready",
      };
      downloadDispatch({ type: "ADD_DOWNLOAD", payload: downloadPayload });
      fetch(image.permanentUrl)
        .then((res) => {
          if (!res.ok)
            throw new Error(`Failed to fetch image: ${res.statusText}`);
          return res.blob();
        })
        .then((blob) => {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          const safePrompt = (image.prompt || "ai_image")
            .slice(0, 30)
            .replace(/[^a-zA-Z0-9]/g, "_");
          a.download = `${safePrompt}-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(a.href);
          showSuccessToast("Image download initiated!");
        })
        .catch((err) => {
          showErrorToast(`Download failed: ${err.message}`);
        });
    },
    [downloadDispatch],
  );

  const handlePromptSelect = (selected) => {
    dispatch({ type: "SET_PROMPT", payload: selected });
  };

  const handlePromptClear = () => {
    dispatch({ type: "SET_HISTORY", payload: [] });
    localStorage.removeItem("lws-ai-prompt-history");
    showSuccessToast("Prompt history cleared.");
  };

  const openModalWithImage = (originalImageIndex) => {
    const clickedImage = state.images[originalImageIndex];
    const indexInModalImages = modalImages.findIndex(
      (img) =>
        img &&
        ((img.id && img.id === clickedImage.id) ||
          img.permanentUrl === clickedImage.permanentUrl),
    );
    if (indexInModalImages !== -1) {
      setCurrentModalImageIndex(indexInModalImages);
      setIsModalOpen(true);
    } else {
      showErrorToast("This image is not ready for preview yet.");
    }
  };

  const handleGenerateMore = useCallback(
    (image) => {
      if (!image) return;

      dispatch({ type: "SET_PROMPT", payload: image.prompt });
      dispatch({ type: "SET_MODEL", payload: image.model });
      dispatch({
        type: "SET_DIMENSIONS",
        payload: { width: image.width, height: image.height },
      });
      dispatch({ type: "SET_SEED", payload: "" });

      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        generateImages(); // This will now default to iterate: true
      }, 100);

      showSuccessToast("Remixing new images based on your selection!");
    },
    [dispatch, generateImages],
  );

  const handlePrimaryGenerate = () => {
    // If a seed exists in the state, tell generateImages NOT to iterate.
    // Otherwise, let it iterate as normal.
    const iterate = !state.seed;
    generateImages({ iterate });
  };

  const closeModal = () => setIsModalOpen(false);

  const goToNextImage = () => {
    if (modalImages.length === 0) return;
    setCurrentModalImageIndex(
      (prevIndex) => (prevIndex + 1) % modalImages.length,
    );
  };

  const goToPreviousImage = () => {
    if (modalImages.length === 0) return;
    setCurrentModalImageIndex(
      (prevIndex) => (prevIndex - 1 + modalImages.length) % modalImages.length,
    );
  };

  return (
    <div>
      <h2 className="text-4xl font-bold mb-8">
        Let's create a masterpiece, Alvian!{" "}
        <span className="text-2xl animate-wave inline-block">👋</span>
      </h2>

      <PromptHistory
        history={state.promptHistory}
        onSelect={handlePromptSelect}
        onClear={handlePromptClear}
      />

      <PromptInput
        prompt={state.prompt}
        onChange={handlePromptChange}
        onGenerate={handlePrimaryGenerate}
        loading={
          state.loading &&
          state.images.some(
            (img) =>
              img && (img.status === "loading" || img.status === "queued"),
          )
        }
        modelsLoading={modelsLoading}
        onTemplatesClick={handleTemplatesClick}
        onGeneratePromptsClick={handleGeneratePromptsClick}
        allPrompts={allPrompts}
      />

      <AdvancedSettings
        model={state.model}
        setModel={(value) => dispatch({ type: "SET_MODEL", payload: value })}
        availableModels={availableModels}
        modelsLoading={modelsLoading}
        seed={state.seed}
        setSeed={(value) => dispatch({ type: "SET_SEED", payload: value })}
        width={state.width}
        height={state.height}
        setDimensions={(width, height) =>
          dispatch({ type: "SET_DIMENSIONS", payload: { width, height } })
        }
        noLogo={state.noLogo}
        setNoLogo={(value) => dispatch({ type: "SET_NOLOGO", payload: value })}
      />

      <ImageGrid
        images={state.images}
        loading={
          state.loading &&
          state.images.every((img) => img && img.status === "queued")
        }
        error={state.error}
        onDownload={handleDownload}
        onImageClick={openModalWithImage}
        onEdit={(img) => setEditorImage(img)}
        onSelectCompare={handleSelectCompare}
        comparisonImages={comparisonImages}
        onGenerateMore={handleGenerateMore}
      />

      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        images={modalImages}
        currentIndex={currentModalImageIndex}
        onPrev={goToPreviousImage}
        onNext={goToNextImage}
        onSelect={(index) => setCurrentModalImageIndex(index)}
      />

      {editorImage && (
        <CanvasEditorModal
          image={editorImage}
          onClose={() => setEditorImage(null)}
        />
      )}

      {isCompareModalOpen && comparisonImages.length === 2 && (
        <ImageCompareModal
          images={comparisonImages}
          onClose={() => {
            setComparisonImages([]);
            setIsCompareModalOpen(false);
          }}
        />
      )}

      {comparisonImages.length === 2 && !isCompareModalOpen && (
        <button
          className="fixed bottom-6 right-6 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-500 transition z-50"
          onClick={() => setIsCompareModalOpen(true)}
        >
          Compare Selected (2)
        </button>
      )}
    </div>
  );
};

export default CreateImagePage;
