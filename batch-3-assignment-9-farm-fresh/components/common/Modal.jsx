"use client";

import { useEffect, useRef } from "react";

export default function Modal({
  title,
  children,
  onClose,
  contentClassName = "max-w-md",
  resetScrollOnOpen = true,
  lockBackgroundScroll = true,
  minBodyHeight = 300,
}) {
  const scrollRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    if (lockBackgroundScroll) {
      const prev = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.documentElement.style.overflow = prev;
      };
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, lockBackgroundScroll]);

  useEffect(() => {
    if (resetScrollOnOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    // focus title for accessibility
    titleRef.current?.focus?.();
  }, [resetScrollOnOpen]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`relative mx-4 w-full ${contentClassName} rounded-lg bg-white p-6 shadow-xl ring-1 ring-black/10 dark:bg-gray-800 dark:ring-white/10`}
        style={{ maxHeight: "85vh" }}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? (
            <h2
              ref={titleRef}
              tabIndex={-1}
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 outline-none"
            >
              {title}
            </h2>
          ) : (
            <span className="sr-only">Modal</span>
          )}
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div
          ref={scrollRef}
          className="overflow-y-auto pr-1"
          style={{ maxHeight: "calc(85vh - 56px)", minHeight: minBodyHeight }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
