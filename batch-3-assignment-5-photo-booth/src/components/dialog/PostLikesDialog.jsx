import { Link, useNavigate } from "react-router";
import Dialog from "./Dialog";
import { useModal } from "../../stores/useModal";
import { useAvatar } from "../../hooks/useAvatar";

const PostLikesDialog = ({ likes }) => {
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const { getAvatar } = useAvatar();

  const navigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
    closeModal();
  };
  return (
    <Dialog>
      <h3 className="text-xl font-semibold text-center mb-2">Likes</h3>
      <div className="max-h-[300px] h-full overflow-x-hidden overflow-y-auto">
        {likes?.map((user) => (
          <div
            key={user?._id}
            className="relative flex w-96 flex-col border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
          >
            <div
              onClick={() => navigateToProfile(user._id)}
              className="text-slate-800 flex w-full items-center p-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800  active:bg-slate-100 dark:active:bg-slate-800 cursor-pointer"
            >
              <div className="mr-4 grid place-items-center">
                <img
                  alt="candice"
                  src={getAvatar(user.avatar)}
                  className="relative inline-block h-12 w-12 !rounded-full  object-cover object-center"
                />
              </div>
              <div>
                <h6 className="text-slate-800 dark:text-slate-200 font-medium">
                  {user?.name}
                </h6>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {user?.bio?.length > 30
                    ? user?.bio?.substr(0, 30) + "..."
                    : user?.bio}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Dialog>
  );
};

export default PostLikesDialog;
