import { useEffect, useState } from "react";
import { useAuth } from "../../stores/useAuth";
import { useSavedPosts } from "../../stores/useSavedPosts";
import { IoBookmarkOutline } from "react-icons/io5";
import { Link } from "react-router";

const SavedPosts = () => {
  const { user } = useAuth();
  const { getUserSavedPosts } = useSavedPosts((state) => state);

  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    if (user) {
      setSavedPosts(getUserSavedPosts(user._id));
    }
  }, [user, getUserSavedPosts]);

  return (
    <div className="main-container px-10">
      <header className="sticky top-0 bg-white dark:bg-slate-950 z-10">
        <div className="flex flex-col gap-1 items-start justify-between py-4">
          <h1 className="text-xl font-semibold">Saved</h1>
          <p className="text-sm font-normal">
            Only you can see what you've saved
          </p>
        </div>
      </header>
      <div className="mt-6 flex flex-col gap-4">
        {user && savedPosts.length === 0 && (
          <div className="text-center flex flex-col items-center justify-center gap-2">
            <IoBookmarkOutline size={36} />
            <span className="text-xl font-semibold">No saved posts.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {savedPosts.map((post) => (
            <Link to={`/posts/${post._id}`} key={post._id}>
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_SERVER_BASE_URL}/${post.image}`}
                  alt="Grid image"
                  className="w-full grid-image"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedPosts;
