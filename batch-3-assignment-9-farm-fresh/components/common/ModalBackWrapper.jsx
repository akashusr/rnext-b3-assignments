"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Modal from "@/components/common/Modal";

export default function ModalBackWrapper({
  title,
  children,
  contentClassName,
  autoCloseOnRouteChange = false,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [initialPath] = useState(pathname); // capture path on mount

  // If enabled, automatically unmount modal when route changes (prevents stale intercept modals)
  if (autoCloseOnRouteChange && pathname !== initialPath) {
    return null;
  }
  return (
    <Modal
      title={title}
      onClose={() => router.back()}
      contentClassName={contentClassName}
    >
      {children}
    </Modal>
  );
}
