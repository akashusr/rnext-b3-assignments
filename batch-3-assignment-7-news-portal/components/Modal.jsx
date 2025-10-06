"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

export default function Modal({ children }) {
  const overlay = useRef(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick = useCallback(
    (e) => {
      if (e.target === overlay.current) {
        onDismiss();
      }
    },
    [onDismiss, overlay]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  // Disable body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <div
      ref={overlay}
      onClick={onClick}
      className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center p-4"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-md shadow-lg">
        {children}
      </div>
    </div>
  );
}