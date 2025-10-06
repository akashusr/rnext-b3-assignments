import { useState } from "react";

export const useImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleUploadImage = async (e, setError) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      setImagePreview(data.base64Data);
      setSelectedImage({
        url: data.url,
        base64Data: data.base64Data,
      });
    } catch (e) {
      setError(`Image upload failed: ${e.message}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedImage(null);
  };

  return {
    selectedImage,
    imagePreview,
    isUploadingImage,
    handleUploadImage,
    removeImage,
    setSelectedImage,
    setImagePreview,
  };
};
