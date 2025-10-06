import api from "../lib/api";
import { useGlobalStore } from "../stores/useGlobalStore";

export const getUserProfile = async () => {
  const { setUser } = useGlobalStore.getState();

  try {
    const response = await api.get("/users/me");

    if (response.status !== 200) throw new Error("Something went wrong");

    setUser(response.data);

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const getUserById = async ({ queryKey }) => {
  const res = await api.get(`/users/${queryKey[1]}`);

  return res.data;
};
