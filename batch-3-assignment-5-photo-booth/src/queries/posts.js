import axios from "axios";

export const fetchPosts = async (page, productsPerPage) => {
  const res = await axios.get(
    `${import.meta.env.VITE_SERVER_BASE_URL}/api/posts`,
    {
      params: {
        page,
        limit: productsPerPage,
      },
    }
  );

  return res.data;
};

export const fetchPostById = async ({ queryKey }) => {
  const res = await axios.get(
    `${import.meta.env.VITE_SERVER_BASE_URL}/api/posts/${queryKey[1]}`
  );

  return res.data;
};

export const fetchPostByUserId = async ({ queryKey }) => {
  const res = await axios.get(
    `${import.meta.env.VITE_SERVER_BASE_URL}/api/posts/user/${queryKey[1]}`
  );

  return res.data;
};
