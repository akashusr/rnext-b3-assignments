import { HiOutlineHome } from "react-icons/hi2";
import { HiOutlineBell } from "react-icons/hi2";
import { AiOutlinePlus } from "react-icons/ai";
import { LuUser } from "react-icons/lu";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router";
import { cn } from "../../lib/utils";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useAuth } from "../../stores/useAuth";
import ThemeSwitcher from "../ThemeSwitcher";
import { useAvatar } from "../../hooks/useAvatar";
import { useGlobalStore } from "../../stores/useGlobalStore";

const NAV_LINKS = [
  {
    path: "/",
    display: "Home",
    icon: <HiOutlineHome size={22} />,
  },
  {
    path: "/notifications",
    display: "Notifications",
    icon: <HiOutlineBell size={22} />,
  },
  {
    path: "/saved",
    display: "Saved",
    icon: <IoBookmarkOutline size={22} />,
  },
  {
    path: "/create-post",
    display: "Create",
    icon: <AiOutlinePlus size={22} />,
  },
  {
    path: "/profile",
    display: "Profile",
    icon: <LuUser size={22} />,
  },
];

const Sidebar = () => {
  const user = useCurrentUser();
  const { setUser, setToken } = useAuth((state) => state);
  const { setUser: setUserProfile } = useGlobalStore((state) => state);
  const navigate = useNavigate();
  const { getAvatar } = useAvatar();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setUser(null);
    setUserProfile(null);
    setToken({ accessToken: null, refreshToken: null });
    navigate("/login");
  };

  return (
    <aside className="hidden floating-navbar bg-white border border-gray-200 dark:border-slate-800 px-6 py-2 pb-3 md:flex flex-col">
      <div className="flex items-center justify-between gap-5 mb-8">
        <Link href="/" className="flex gap-2 items-center font-medium py-4 ">
          <img
            src="/assets/logo-2.svg"
            alt="PhotoBooth"
            className="h-6 object-contain"
          />
          <h2 className="text-lg">Photo Booth</h2>
        </Link>
        <ThemeSwitcher />
      </div>

      <ul className="space-y-8 flex-1">
        {NAV_LINKS.map((navItem, index) => (
          <li key={index}>
            <NavLink
              to={navItem.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-row items-center gap-2 px-3 py-2 rounded-md text-zinc-800 dark:text-slate-300",
                  isActive &&
                    "bg-[#fde5ff]/40 dark:bg-slate-900 text-[#e95886] dark:text-slate-200"
                )
              }
            >
              {navItem.icon}
              <span className="text-sm ">{navItem.display}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {user && (
        <div className="flex justify-between">
          <Link to="/profile">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-300">
                <img
                  src={
                    (user?.avatar && getAvatar(user.avatar)) ||
                    "/assets/avatar.svg"
                  }
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-2 flex flex-col gap-2">
                <span className="font-semibold text-sm">{user?.name}</span>
                <p className="text-xs text-gray-500 dark:text-slate-300  leading-0">
                  {user?.username || "@devmuhib"}
                </p>
              </div>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            title="logout"
            className="cursor-pointer"
          >
            <IoLogOutOutline size={20} />
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
