import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const usePosts = (user) => {
  const productsPerPage = user ? 10 : 3;

  const fetchPosts = async ({ pageParam = 0 }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/posts`,
        {
          params: {
            page: pageParam,
            limit: productsPerPage,
          },
        }
      );
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch posts");
    }
  };

  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;

      return allPages.length;
    },
    initialPageParam: 0,
  });
};
