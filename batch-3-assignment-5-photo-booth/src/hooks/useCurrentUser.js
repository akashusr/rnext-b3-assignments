import { useAuth } from "../stores/useAuth";
import { useGlobalStore } from "../stores/useGlobalStore";

const useCurrentUser = () => {
  const { user } = useGlobalStore((state) => state);
  const { user: authUser } = useAuth((state) => state);

  const currentUser = user ?? authUser;

  return currentUser;
};

export default useCurrentUser;
