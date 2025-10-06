import React from "react";

import NavbarLogo from "./NavbarLogo";
import NavbarDesktop from "./NavbarDesktop";
import NavbarActions from "./NavbarActions";
import NavbarMobile from "./NavbarMobile";
import { auth } from "@/auth";

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* <!-- Logo --> */}
          <NavbarLogo />

          {/* <!-- Desktop Navigation --> */}
          <NavbarDesktop session={session} />

          {/* <!-- User Actions --> */}
          <div className="flex items-center space-x-2">
            <NavbarActions session={session} />

            {/* <!-- Mobile Navigation --> */}
            <NavbarMobile session={session} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
