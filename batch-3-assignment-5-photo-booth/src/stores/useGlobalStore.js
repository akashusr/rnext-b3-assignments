import { create } from "zustand";

export const useGlobalStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (updates) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),
}));
