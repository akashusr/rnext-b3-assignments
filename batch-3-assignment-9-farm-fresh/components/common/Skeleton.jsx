import React from "react";
import { uiTokens, cn } from "./uiTokens";

// Generic Skeleton utility
// variant: text|rect|circle|badge|button|title|avatar
export default function Skeleton({
  variant = "rect",
  lines = 1,
  width,
  height,
  size,
  className,
}) {
  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)} aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              uiTokens.animation.pulse,
              "h-3 rounded",
              i === lines - 1 ? "w-5/6" : "w-full",
              uiTokens.colors.skeleton
            )}
          />
        ))}
      </div>
    );
  }

  const base = cn(
    uiTokens.animation.pulse,
    "rounded-md",
    uiTokens.colors.skeleton,
    className
  );

  if (variant === "circle" || variant === "avatar") {
    const dim = size || width || height || 48;
    return (
      <div
        aria-hidden="true"
        className={cn(base, "rounded-full")}
        style={{ width: dim, height: dim }}
      />
    );
  }
  if (variant === "badge") {
    return (
      <div
        aria-hidden="true"
        className={cn(base, "h-5 inline-block align-middle px-8")}
      />
    );
  }
  if (variant === "button") {
    return (
      <div
        aria-hidden="true"
        className={cn(base, "h-10 inline-block align-middle px-16")}
      />
    );
  }
  if (variant === "title") {
    return (
      <div aria-hidden="true" className={cn(base, "h-6 w-2/3 max-w-md mb-4")} />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={base}
      style={{ width: width || "100%", height: height || size || 80 }}
    />
  );
}
