const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("Please define the GEMINI_API_KEY environment variable");
}

const MAX_RETRIES = 2;
const TIMEOUT_MS = 30000;
const GEMINI_25_PRO_TIMEOUT = 90000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function makeApiRequest(
  url,
  options,
  retries = MAX_RETRIES,
  customTimeout = null,
) {
  try {
    const controller = new AbortController();
    const timeoutMs = customTimeout || TIMEOUT_MS;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    return response;
  } catch (error) {
    if (
      retries > 0 &&
      (error.name === "TimeoutError" ||
        error.name === "AbortError" ||
        (error.cause && error.cause.code === "UND_ERR_CONNECT_TIMEOUT"))
    ) {
      const backoffTime = 1000 * (MAX_RETRIES - retries + 1);
      await wait(backoffTime);
      return makeApiRequest(url, options, retries - 1, customTimeout);
    }

    if (
      error.name === "TimeoutError" ||
      error.name === "AbortError" ||
      (error.cause && error.cause.code === "UND_ERR_CONNECT_TIMEOUT")
    ) {
      throw new Error(
        "Connection timeout when calling Gemini API. Please try again later.",
      );
    }
    throw error;
  }
}

export async function getGeminiResponse(messages, model, systemPrompt = "") {
  let contents = messages.map((m) => {
    if (m.imageData) {
      try {
        const textContent =
          systemPrompt && systemPrompt.trim()
            ? `${systemPrompt}\n\n${m.content || ""}`
            : m.content || "";

        return {
          role: m.role === "assistant" ? "model" : m.role,
          parts: [
            { text: textContent },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: m.imageData.startsWith("data:")
                  ? m.imageData.split(",")[1]
                  : m.imageData,
              },
            },
          ],
        };
      } catch (error) {
        return {
          role: m.role === "assistant" ? "model" : m.role,
          parts: [{ text: m.content || "Image processing failed" }],
        };
      }
    } else if (m.imageUrl) {
      return {
        role: m.role === "assistant" ? "model" : m.role,
        parts: [
          { text: m.content || "Image attached (but can't be processed)" },
        ],
      };
    }

    return {
      role: m.role === "assistant" ? "model" : m.role,
      parts: [{ text: m.content }],
    };
  });

  const hasImages = messages.some((m) => m.imageData);

  if (systemPrompt && systemPrompt.trim()) {
    if (!hasImages) {
      contents.unshift({
        role: "user",
        parts: [{ text: systemPrompt }],
      });
    } else {
      contents = contents.map((content, index) => {
        if (index === 0 && content.role === "user") {
          const currentText = content.parts[0]?.text || "";
          if (!currentText.includes(systemPrompt)) {
            return {
              ...content,
              parts: content.parts.map((part, partIndex) =>
                partIndex === 0 && part.text
                  ? { ...part, text: `${systemPrompt}\n\n${part.text}` }
                  : part,
              ),
            };
          }
        }
        return content;
      });
    }
  }

  let modelName =
    typeof model === "string" && model ? model : "gemini-1.5-flash";

  const multimodalModels = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.5-pro-001",
    "gemini-1.5-pro-002",
    "gemini-2.5-pro",
  ];

  if (hasImages && !multimodalModels.some((m) => modelName.includes(m))) {
    modelName = "gemini-1.5-flash";
  }

  if (!modelName.startsWith("models/")) {
    modelName = `models/${modelName}`;
  }

  const url = `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents }),
  };

  const isGemini25Pro = modelName.includes("gemini-2.5-pro");
  const hasSystemPrompt = systemPrompt && systemPrompt.trim();
  const customTimeout =
    isGemini25Pro && hasSystemPrompt ? GEMINI_25_PRO_TIMEOUT : null;

  try {
    const response = await makeApiRequest(
      url,
      options,
      MAX_RETRIES,
      customTimeout,
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return text || "[No response from Gemini API]";
  } catch (error) {
    if (hasImages && error.message?.includes("not supported")) {
      modelName = "models/gemini-1.5-flash";

      const fallbackUrl = `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
      const fallbackResponse = await makeApiRequest(fallbackUrl, {
        ...options,
        body: JSON.stringify({ contents }),
      });

      const fallbackData = await fallbackResponse.json();
      const fallbackText =
        fallbackData?.candidates?.[0]?.content?.parts?.[0]?.text;

      return fallbackText || "[No response from fallback model]";
    }

    throw error;
  }
}

export async function streamGeminiResponse(messages, model) {
  const contents = messages.map((m) => {
    if (m.imageUrl) {
      try {
        return {
          role: m.role === "assistant" ? "model" : m.role,
          parts: [
            { text: m.content || "" },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: m.imageUrl.startsWith("data:")
                  ? m.imageUrl.split(",")[1]
                  : `image-url:${m.imageUrl}`,
              },
            },
          ],
        };
      } catch (error) {
        return {
          role: m.role === "assistant" ? "model" : m.role,
          parts: [{ text: m.content || "Image processing failed" }],
        };
      }
    }

    return {
      role: m.role === "assistant" ? "model" : m.role,
      parts: [{ text: m.content }],
    };
  });

  let modelName =
    typeof model === "string" && model ? model : "gemini-1.5-flash";
  if (!modelName.startsWith("models/")) {
    modelName = `models/${modelName}`;
  }

  if (messages.some((m) => m.imageUrl)) {
    if (!modelName.includes("pro")) {
      modelName = "models/gemini-1.5-pro-002";
    }
  }

  const url = `https://generativelanguage.googleapis.com/v1/${modelName}:streamGenerateContent?key=${GEMINI_API_KEY}`;

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents }),
  };

  return await makeApiRequest(url, options);
}
