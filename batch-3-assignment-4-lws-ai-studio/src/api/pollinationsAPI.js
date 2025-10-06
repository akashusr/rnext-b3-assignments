const API_BASE_URL = "https://image.pollinations.ai";

export const fetchAvailableModels = async () => {
  const response = await fetch(`${API_BASE_URL}/models`);
  if (!response.ok) {
    throw new Error("Could not fetch AI models.");
  }
  const data = await response.json();
  return data.map((modelName) => ({
    value: modelName,
    label: modelName
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
  }));
};

export const generateImageFromApi = async (params) => {
  const searchParams = new URLSearchParams({
    model: params.model,
    width: params.width,
    height: params.height,
    seed: params.seed,
  });

  if (params.noLogo) {
    searchParams.append("nologo", "true");
  }

  const url = `${API_BASE_URL}/prompt/${encodeURIComponent(
    params.prompt,
  )}?${searchParams.toString()}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  const res = await fetch(url, { signal: controller.signal });
  clearTimeout(timeoutId);

  if (!res.ok || !res.headers.get("Content-Type")?.startsWith("image/")) {
    throw new Error(`Invalid image response for seed ${params.seed}`);
  }

  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);

  return {
    displayUrl: blobUrl,
    permanentUrl: url,
    prompt: params.prompt,
    model: params.model,
    seed: params.seed,
    width: params.width,
    height: params.height,
  };
};
