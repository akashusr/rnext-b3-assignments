import toast from "react-hot-toast";

// ⚠️ Amber warning toast
export const showWarningToast = (message) => {
  toast(message, {
    icon: "⚠️",
    style: {
      background: "#facc15", // amber
      color: "#000", // black text
    },
  });
};

// ✅ Green success toast
export const showSuccessToast = (message) => {
  toast.success(message);
};

// ❌ Red error toast
export const showErrorToast = (message) => {
  toast.error(message);
};
