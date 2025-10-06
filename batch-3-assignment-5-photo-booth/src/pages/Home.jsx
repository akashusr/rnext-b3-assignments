import PostFeed from "../components/posts/PostFeed";
import Sidebar from "../components/shared/Sidebar";

import { useEffect, useRef } from "react";
import useCurrentUser from "../hooks/useCurrentUser";
import { useModal } from "../stores/useModal";
import { usePosts } from "../hooks/usePosts";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";

const Home = () => {
  const loadMoreRef = useRef(null);
  const user = useCurrentUser();
  const { openModal, setAuthError } = useModal((state) => state);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    isLoading,
  } = usePosts(user);

  useEffect(() => {
    if (!hasNextPage) return;

    const handleOnIntersection = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        if (hasNextPage && user) {
          setAuthError(null);
          fetchNextPage();
        } else if (!user) {
          setAuthError("Authentication is required");
          openModal();
        }
      }
    };

    const observer = new IntersectionObserver(
      handleOnIntersection,
      { threshold: 0.1 } // Observes when 10% of the loader element is visible
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage, user, openModal, setAuthError]);

  // Flatten the pages array

  const posts =
    data?.pages
      .flat()
      .filter(
        (post, index, self) =>
          index === self.findIndex((p) => p._id === post._id)
      ) || [];

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message} />;
  }

  return (
    <section>
      <Sidebar />

      <div className="max-w-6xl mx-auto w-full py-10  ">
        {posts && <PostFeed posts={posts} />}

        <div ref={loadMoreRef} className="flex justify-center">
          {isFetchingNextPage && (
            <button className="primary-button !w-max mx-auto">
              Loading...
            </button>
          )}
        </div>
        {/* Show message when no more posts */}
        {!hasNextPage && !isFetchingNextPage && (
          <div className="text-center font-sm font-medium">
            No more posts to load
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
