import Link from "next/link";
import HomeIcon from "./icons/HomeIcon";  
import SearchIcon from "./icons/SearchIcon";  
import NotificationIcon from "./icons/NotificationIcon";  
import ProfileIcon from "./icons/ProfileIcon";  

const BottomNavigation = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex justify-between">
        <Link href="/" className="flex flex-col items-center">
          <HomeIcon />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/" className="flex flex-col items-center">
          <SearchIcon />
          <span className="text-xs mt-1">Search</span>
        </Link>
        <Link href="#" className="flex flex-col items-center">
          <NotificationIcon />
          <span className="text-xs mt-1">Notifications</span>
        </Link>
        <Link href="#" className="flex flex-col items-center">
          <ProfileIcon />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
