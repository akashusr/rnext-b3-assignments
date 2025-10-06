import Link from "next/link";
import Image from "next/image";
import HamburgerIcon from "./icons/HamburgerIcon.jsx";
const Header = () => {
  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image src="./logo.svg" alt="Logo" width={120} height={120} />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            Get started
          </Link>
        </nav>

        <button className="md:hidden">
          <HamburgerIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
