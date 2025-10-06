import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";
import { useEffect, useRef } from "react";
import { useModal } from "../../stores/useModal";
import Button from "../ui/Button";
import { GrClose } from "react-icons/gr";

export const DialogOverlay = ({ children }) => {
  const { closeModal } = useModal((state) => state);
  const overlayRef = useRef(null);

  // close modal when ESC key is triggered
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  // Handle outside click
  const handleClickOutside = (e) => {
    e.stopPropagation();

    if (e.target === overlayRef.current) {
      closeModal();
    }
  };

  return createPortal(
    <div
      ref={overlayRef}
      role="modal"
      aria-modal="true"
      onClick={handleClickOutside}
      className="fixed top-0 left-0 z-50 w-full h-screen overflow-x-hidden overflow-y-auto p-10 bg-slate-950/20 dark:bg-slate-950/80"
    >
      {children}
    </div>,
    document.body
  );
};

const Dialog = ({ children, className }) => {
  const { closeModal } = useModal((state) => state);

  return (
    <DialogOverlay>
      <div
        className={cn(
          "dialog absolute top-1/2 left-1/2 -translate-1/2",
          className
        )}
      >
        <div className="p-8 flex flex-col items-center">{children}</div>

        <Button className={"absolute top-4 right-4"} onClick={closeModal}>
          <GrClose size={14} />
        </Button>
      </div>
    </DialogOverlay>
  );
};

export default Dialog;
