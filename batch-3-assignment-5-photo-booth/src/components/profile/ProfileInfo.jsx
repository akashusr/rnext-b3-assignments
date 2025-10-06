import { IoIosLink } from "react-icons/io";
import { Link } from "react-router";
import StatItem from "./StatItem";
import useCurrentUser from "../../hooks/useCurrentUser";

const ProfileInfo = ({ user }) => {
  const authUser = useCurrentUser();
  return (
    <div className="md:w-2/3">
      {/* <!-- Username and Buttons --> */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4">
        <h2 className="text-xl font-normal mb-4 sm:mb-0 sm:mr-4">
          {user?.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 h-full mt-1">
          {user?.username || "@devmuhib"}
        </p>
      </div>
      {authUser?._id === user?._id && (
        <div className="flex space-x-2">
          <Link
            to="/edit-profile"
            className="bg-gray-100 dark:bg-slate-800 px-4 py-1.5 rounded-md text-sm font-medium"
          >
            Edit profile
          </Link>
        </div>
      )}

      {/* <!-- Stats --> */}
      <div className="flex justify-center sm:justify-start space-x-8 mb-4 mt-2">
        <StatItem count={53} label={"posts"} />
        <StatItem count={297} label={"followers"} />
        <StatItem count={314} label={"following"} />
      </div>

      {/* <!-- Bio --> */}
      <div className="text-sm">
        <p>{user?.bio}</p>
        <p className="text-blue-900 dark:text-blue-400">
          <Link
            to={user?.website}
            target="_blank"
            className="flex items-center gap-1"
          >
            <IoIosLink />
            {user?.website}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ProfileInfo;
