import React from "react";
import { Link } from "react-router";
import { formatDateTime } from "../../utils";
import { useAvatar } from "../../hooks/useAvatar";

const PostHeader = ({ user }) => {
  const { getAvatar } = useAvatar();
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-slate-800">
      <Link to={`/profile/${user._id}`}>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              <img
                src={getAvatar(user?.avatar)}
                alt="User avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <div className="ml-2">
            <div className="flex items-center">
              <span className="font-semibold text-sm">{user?.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-[10px] text-gray-600 dark:text-slate-400">
                {formatDateTime(user?.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostHeader;
