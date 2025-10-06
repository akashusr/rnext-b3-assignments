import { create } from "zustand";

export const useModal = create((set) => ({
  isOpen: false,
  activePost: null,
  authError: { message: null, source: null },

  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false, activePost: null, authError: null }),
  setActivePost: (post) => set({ activePost: post }),
  setAuthError: (error, source = null) =>
    set({ authError: { message: error, source: source } }),
}));
