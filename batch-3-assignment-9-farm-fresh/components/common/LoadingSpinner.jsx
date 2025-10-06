import React from "react";
import { uiTokens, cn } from "./uiTokens";

// Accessible loading spinner
// Props: size (sm|md|lg), label (screen-reader text)
export default function LoadingSpinner({ size = "md", label = "Loading" }) {
  const dims = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-4",
  }[size];

  return (
    <div role="status" className="inline-flex items-center gap-2">
      <span
        className={cn(
          "inline-block rounded-full border-current border-t-transparent",
          uiTokens.animation.spin,
          dims
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
