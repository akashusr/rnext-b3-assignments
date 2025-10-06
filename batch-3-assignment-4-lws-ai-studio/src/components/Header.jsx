import React, { useState } from "react";
import logo from "../assets/logo.svg";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Header = ({ currentPage, navigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkClasses = "hover:text-zinc-200 cursor-pointer transition-all";
  const activeLinkClasses = "font-medium text-zinc-200";

  const mobileLinkClasses = "block px-4 py-3 text-base rounded-md";
  const activeMobileLinkClasses = "bg-purple-700 text-white";
  const inactiveMobileLinkClasses =
    "text-zinc-300 hover:bg-zinc-700 hover:text-white";

  const handleNavigate = (page) => {
    navigate(page);
    setIsMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      <li>
        <a
          onClick={() => handleNavigate("create")}
          className={`${linkClasses} ${currentPage === "create" ? activeLinkClasses : ""}`}
        >
          Create Image
        </a>
      </li>
      <li>
        <a
          onClick={() => handleNavigate("collections")}
          className={`${linkClasses} ${currentPage === "collections" ? activeLinkClasses : ""}`}
        >
          Collections
        </a>
      </li>
      <li>
        <a
          onClick={() => handleNavigate("downloaded")}
          className={`${linkClasses} ${currentPage === "downloaded" ? activeLinkClasses : ""}`}
        >
          Downloaded
        </a>
      </li>
      <li>
        <a
          onClick={() => handleNavigate("favourites")}
          className={`${linkClasses} ${currentPage === "favourites" ? activeLinkClasses : ""}`}
        >
          Favourites
        </a>
      </li>
      <li>
        <a
          onClick={() => handleNavigate("stats")}
          className={`${linkClasses} ${currentPage === "stats" ? activeLinkClasses : ""}`}
        >
          My Stats
        </a>
      </li>
      <li>
        <a
          onClick={() => handleNavigate("settings")}
          className={`${linkClasses} ${currentPage === "settings" ? activeLinkClasses : ""}`}
        >
          Settings
        </a>
      </li>
    </>
  );

  const MobileNavLinks = () => (
    <>
      <li>
        <a
          onClick={() => handleNavigate("create")}
          className={`${mobileLinkClasses} ${currentPage === "create" ? activeMobileLinkClasses : inactiveMobileLinkClasses}`}
        >
          Create Image
        </a>
      </li>
      <li>
        <a
          onClick={() => handleNavigate("collections")}
          className={`${mobileLinkClasses} ${currentPage === "collections" ? activeMobileLinkClasses : inactiveMobileLinkClasses}`}
        >
          Collections
        </a>
      </li>
      <li>
        <a
          onClick={() => handleNavigate("downloaded")}
          className={`${mobileLinkClasses} ${currentPage === "downloaded" ? activeMobileLinkClasses : inactiveMobileLinkClasses}`}
        >
          Downloaded
        </a>
      </li>
      <li>
        <a
          onClick={() => handleNavigate("favourites")}
          className={`${mobileLinkClasses} ${currentPage === "favourites" ? activeMobileLinkClasses : inactiveMobileLinkClasses}`}
        >
          Favourites
        </a>
      </li>
      <li>
        <a
          onClick={() => handleNavigate("stats")}
          className={`${mobileLinkClasses} ${currentPage === "stats" ? activeMobileLinkClasses : inactiveMobileLinkClasses}`}
        >
          My Stats
        </a>
      </li>
      <li>
        <a
          onClick={() => handleNavigate("settings")}
          className={`${mobileLinkClasses} ${currentPage === "settings" ? activeMobileLinkClasses : inactiveMobileLinkClasses}`}
        >
          Settings
        </a>
      </li>
    </>
  );

  return (
    <header className="relative flex items-center mb-12 justify-between">
      <div className="flex items-center">
        <img src={logo} className="h-10" alt="LWS AI Studio Logo" />
      </div>

      <ul className="hidden md:flex ml-4 text-sm text-zinc-400 gap-8">
        <NavLinks />
      </ul>

      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          aria-label="Open main menu"
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full right-0 mt-2 w-48 z-20">
          <ul className="bg-zinc-800/90 backdrop-blur-sm border border-zinc-700 rounded-lg shadow-lg p-2 space-y-1">
            <MobileNavLinks />
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
