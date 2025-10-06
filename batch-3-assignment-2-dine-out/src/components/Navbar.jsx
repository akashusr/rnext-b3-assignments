import ImgUserIcon from "../assets/images/user.svg";
import ImgLogo from "/logo.svg";

export default function Navbar() {
  return (
    <nav className="bg-navbg mt-4 flex items-center justify-between rounded-full px-8 py-3">
      <div className="flex items-center">
        <div className="text-primary mr-2">
          <img src={ImgLogo} />
        </div>
        <h1 className="text-2xl font-bold">
          <span className="text-primary">Dine</span>Out
        </h1>
      </div>
      <div className="flex items-center">
        <img src={ImgUserIcon} className="h-10" />
      </div>
    </nav>
  );
}
