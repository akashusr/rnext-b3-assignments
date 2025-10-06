import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllNotifications } from "../../queries/notifications";
import { formatDate } from "../../utils";
import { useNavigate } from "react-router";
import Loader from "../../components/ui/Loader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { FiBell } from "react-icons/fi";
import { useAvatar } from "../../hooks/useAvatar";

const Notification = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchAllNotifications,
    retry: false,
  });

  const navigate = useNavigate();
  const { getAvatar } = useAvatar();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message} />;
  }

  const handleClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="notifications-container">
      {/* <!-- Header --> */}
      <header className="sticky top-0 bg-white dark:bg-slate-950 z-10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold">Notifications</h1>
        </div>
      </header>

      {/* <!-- Notifications List --> */}
      <div className="notifications-list">
        {/* <!-- Today Section --> */}
        {/* <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-base font-semibold">Today</h2>
        </div> */}
        {data.length > 0 ? (
          data?.map((n) => (
            <div
              onClick={() => handleClick(n.postId)}
              key={n._id}
              className="notification-item flex items-center p-4 border-b border-gray-100 dark:border-slate-800 cursor-pointer"
            >
              <div className="relative">
                <div className="w-11 h-11 rounded-full overflow-hidden mr-3">
                  <img
                    src={getAvatar(n.fromUser.avatar)}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 mr-3">
                <p className="text-sm">
                  <span className="font-semibold">{n.fromUser.name}</span>{" "}
                  {n.type === "like" ? "liked" : "commented on"} your photo.
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  {formatDate(n.createdAt)}
                </p>
              </div>
              {/* <div className="w-11 h-11 rounded overflow-hidden">
                <img
                  src="/assets/users/user-1.png"
                  alt="Post thumbnail"
                  className="post-thumbnail"
                />
              </div> */}
            </div>
          ))
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center py-5 ">
            <FiBell size={36} />

            <span>No notification found</span>
          </div>
        )}

        {/* <!-- Padding at bottom for scroll --> */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default Notification;
