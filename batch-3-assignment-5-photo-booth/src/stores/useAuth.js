import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuth = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setToken: (tokens) =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth",
    }
  )
);
