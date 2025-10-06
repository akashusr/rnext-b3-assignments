import { useState } from "react";

export const useStreaming = (conversationId) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");

  const handleStreamingResponse = async ({
    messageText,
    imagePreview,
    imageData,
    setMessages,
    setInput,
    setLoading,
    setError,
    setSelectedImage,
    setImagePreview,
    selectedImage,
  }) => {
    const textToSend = String(messageText || "");
    if (!textToSend.trim() && !selectedImage) return;

    setLoading(true);
    setIsStreaming(true);
    setError("");
    setStreamedContent("");

    const optimisticUserMsg = {
      _id: Date.now().toString(),
      role: "user",
      content: textToSend,
      imageData: imagePreview,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUserMsg]);

    const placeholderAssistantMsg = {
      _id: `streaming-${Date.now()}`,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, placeholderAssistantMsg]);
    setInput("");

    const requestImageData = selectedImage ? selectedImage.base64Data : null;

    if (imagePreview) {
      setSelectedImage(null);
      setImagePreview(null);
    }

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: textToSend,
          imageUrl: imagePreview,
          imageData: requestImageData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get streaming response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedContent = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.substring(5).trim();

            if (data === "[DONE]") {
              setIsStreaming(false);
              continue;
            }

            try {
              const parsedData = JSON.parse(data);
              if (parsedData.text) {
                accumulatedContent += parsedData.text;
                setStreamedContent(accumulatedContent);

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg._id === placeholderAssistantMsg._id
                      ? { ...msg, content: accumulatedContent }
                      : msg,
                  ),
                );
              }

              if (parsedData.error) {
                setError(`Streaming error: ${parsedData.error}`);
                break;
              }
            } catch (e) {
              console.error(
                "Error parsing streaming data:",
                e,
                "Raw data:",
                data,
              );
            }
          }
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === placeholderAssistantMsg._id
            ? { ...msg, isStreaming: false }
            : msg,
        ),
      );
    } catch (e) {
      setError(`Streaming error: ${e.message}`);
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== placeholderAssistantMsg._id),
      );
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const handleMessageRegenerate = async ({
    messages,
    setMessages,
    setLoading,
    setError,
  }) => {
    if (messages.length < 2) return;

    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((msg) => msg.role === "user");
    if (!lastUserMessage) return;

    setLoading(true);
    setIsStreaming(true);
    setError("");

    const placeholderAssistantMsg = {
      _id: `regenerated-${Date.now()}`,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, placeholderAssistantMsg]);

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: lastUserMessage.content,
          imageUrl: lastUserMessage.imageData,
          imageData: lastUserMessage.imageData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get streaming response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedContent = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.substring(5).trim();

            if (data === "[DONE]") {
              setIsStreaming(false);
              continue;
            }

            try {
              const parsedData = JSON.parse(data);
              if (parsedData.text) {
                accumulatedContent += parsedData.text;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg._id === placeholderAssistantMsg._id
                      ? { ...msg, content: accumulatedContent }
                      : msg,
                  ),
                );
              }

              if (parsedData.error) {
                setError(`Streaming error: ${parsedData.error}`);
                break;
              }
            } catch (e) {
              console.error("Error parsing streaming data:", e);
            }
          }
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === placeholderAssistantMsg._id
            ? { ...msg, isStreaming: false }
            : msg,
        ),
      );
    } catch (e) {
      setError(`Regeneration error: ${e.message}`);
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== placeholderAssistantMsg._id),
      );
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  return {
    isStreaming,
    setIsStreaming,
    streamedContent,
    handleStreamingResponse,
    handleMessageRegenerate,
  };
};
