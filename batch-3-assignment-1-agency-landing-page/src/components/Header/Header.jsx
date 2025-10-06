import Button from "../UI/Button";
import HeaderLogo from "./HeaderLogo";
import HeaderNav from "./HeaderNav";

export default function Header() {
  return (
    <header className="fixed w-full">
      <nav className="border-gray-200 bg-white py-2.5 dark:bg-gray-900">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4">
          <HeaderLogo />
          <div className="flex items-center lg:order-2">
            <Button to="#" type="primary">
              Download
            </Button>
          </div>
          <div
            className="hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto"
            id="mobile-menu-2"
          >
            <HeaderNav />
          </div>
        </div>
      </nav>
    </header>
  );
}
