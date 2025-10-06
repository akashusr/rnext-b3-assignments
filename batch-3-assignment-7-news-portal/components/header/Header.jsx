import Logo from "./Logo";
import SubscribeButton from "./SubscribeButton";
import NavLists from "./NavLists";
const Header = ({ lang }) => {
  
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo lang={lang}/>

        <div className="flex items-center space-x-6">
          <SubscribeButton />

          <NavLists lang={lang}/>
        </div>
      </div>
    </header>
  );
};

export default Header;
