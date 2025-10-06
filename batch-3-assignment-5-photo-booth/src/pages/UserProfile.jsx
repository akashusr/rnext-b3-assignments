import ProfileInfo from "../components/profile/ProfileInfo";
import PostGrid from "../components/posts/PostGrid";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../queries/profile";
import useCurrentUser from "../hooks/useCurrentUser";
import { fetchPostByUserId } from "../queries/posts";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { useAvatar } from "../hooks/useAvatar";

const UserProfile = () => {
  const user = useCurrentUser();

  const { userId } = useParams();
  const navigate = useNavigate();
  const { getAvatar } = useAvatar();

  useEffect(() => {
    if (user && user._id === userId) {
      navigate("/profile", { replace: true });
    }
  }, [user, userId, navigate]);

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: getUserById,
    retry: false,
  });

  const {
    data,
    isLoading: isUserPostsLoading,
    isError: isUserPostsError,
  } = useQuery({
    queryKey: ["user-posts", userId],
    queryFn: fetchPostByUserId,
    retry: false,
  });

  if (isLoading || isUserPostsLoading) return <Loader />;

  if (error || isUserPostsError)
    return <ErrorMessage message={error?.message} />;

  return (
    <div className="main-container">
      <div className="profile-container">
        {/* <!-- Profile Header --> */}
        <div className="flex flex-col md:flex-row mb-10">
          <div className="flex justify-items-end md:justify-start md:w-1/3 mb-6 md:mb-0 relative">
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border border-gray-300 mx-auto">
              <img
                src={
                  (userData?.avatar && getAvatar(userData.avatar)) ||
                  "/assets/avatar.svg"
                }
                alt="Profile picture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <ProfileInfo user={userData} />
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Posts</h3>
          <PostGrid posts={data?.posts} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
