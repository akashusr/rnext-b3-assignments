import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSavedPosts = create(
  persist(
    (set, get) => ({
      saved: {}, // { [userId]: [posts] }
      savePost: (userId, post) => {
        const userPosts = get().saved[userId] || [];
        if (!userPosts.find((p) => p._id === post._id)) {
          set((state) => ({
            saved: {
              ...state.saved,
              [userId]: [...userPosts, post],
            },
          }));
        }
      },
      removeSavedPost: (userId, postId) => {
        const userPosts = get().saved[userId] || [];
        set((state) => ({
          saved: {
            ...state.saved,
            [userId]: userPosts.filter((p) => p._id !== postId),
          },
        }));
      },
      getUserSavedPosts: (userId) => get().saved[userId] || [],
    }),
    {
      name: "saved-posts",
    }
  )
);
