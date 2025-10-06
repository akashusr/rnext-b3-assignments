import { faSeedling } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

const NavbarLogo = () => {
  return (
    <Link className="flex items-center space-x-3" href="/">
      <div className="bg-primary-500 p-2 rounded-lg">
        <FontAwesomeIcon icon={faSeedling} className="text-white text-xl" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          FarmFresh
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Local Farmer Booking
        </p>
      </div>
    </Link>
  );
};

export default NavbarLogo;
