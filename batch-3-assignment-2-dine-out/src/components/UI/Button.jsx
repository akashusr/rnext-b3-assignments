/**
 * Button Component
 * @param {Object} param
 * @param {"icon" | "primary" | "danger--small" | "success--small"} param.variant
 */
export default function Button({ children, onClick, variant, className }) {
  return (
    <button
      className={`${
        variant === "icon"
          ? "hover:bg-primary flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 transition-colors duration-300"
          : ""
      } ${
        variant === "primary"
          ? "bg-primary hover:bg-opacity-90 w-full transform rounded-full py-3 font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          : ""
      } ${
        variant === "danger--small"
          ? "rounded-full bg-gray-800 px-3 py-1 text-xs transition-colors duration-300 hover:bg-red-600"
          : ""
      } ${
        variant === "success--small"
          ? "rounded-full bg-gray-800 px-3 py-1 text-xs transition-colors duration-300 hover:bg-green-600"
          : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
