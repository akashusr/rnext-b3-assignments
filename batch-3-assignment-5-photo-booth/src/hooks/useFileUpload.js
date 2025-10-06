import { useState } from "react";

const useFileUpload = (onUpload) => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);

      setFile(selectedFile);
      if (onUpload) {
        onUpload(selectedFile);
      }
    }
  };

  return {
    preview,
    setPreview,
    file,
    handleFileSelect,
  };
};

export default useFileUpload;
