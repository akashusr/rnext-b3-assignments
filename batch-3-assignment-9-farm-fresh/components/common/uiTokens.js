// Design tokens / central helpers for loading & state UIs
// Keep tokens simple; avoid dynamic Tailwind class construction that would get purged.
export const uiTokens = {
  colors: {
    primary: "green-700",
    primaryHover: "green-800",
    borderLight: "border-gray-300 dark:border-gray-700",
    textMuted: "text-gray-500 dark:text-gray-400",
    skeleton: "bg-gray-200 dark:bg-gray-700",
    skeletonAccent: "bg-gray-300 dark:bg-gray-600",
    dangerText: "text-red-600 dark:text-red-400",
  },
  radii: {
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  },
  spacing: {
    gutterX: "px-4 sm:px-6 lg:px-8",
    gutterY: "py-8",
  },
  animation: {
    pulse: "animate-pulse",
    spin: "animate-spin",
  },
};

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
