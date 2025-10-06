import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import SearchLogo from "./icons/SearchLogo";
import ShopingLogo from "./icons/ShoppingLogo";
import PeopleLogo from "./icons/PeopleLogo";
import LwsLogo from "./icons/LwsLogo.jsx";
const navList = [
  {
    name: "Shop",
    link: "#"
  },
  {
    name: "On sale",
    link: "#"
  },
  {
    name: "New Arrivals",
    link: "#"
  },
  {
    name: "Brands",
    link: "#"
  }
];

const Header = ({ searchQuery, onSearch }) => {
  const { products, productsDispatch } = useProducts();
  const { cart } = useCart();


  return (
    <header className="border-b border-gray-200 py-4 px-4 md:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <LwsLogo />

        <nav className="hidden md:flex space-x-6">
          {navList.map(nav => (
            <a
              key={nav.name}
              href={nav.link}
              className="hover:text-gray-500 transition-colors"
            >
              {nav.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block w-64">
            <input
              value={searchQuery}
              onChange={e => onSearch(e)}
              type="text"
              placeholder="Search for products..."
              className="w-full bg-gray-100 rounded-full py-2 px-4 text-sm"
            />
            <span className="absolute right-3 top-2">
              <SearchLogo />
            </span>
          </div>

          <a
            href="#"
            className="relative hover:text-gray-500 transition-colors"
          >
            <div className="absolute rounded-full flex items-center justify-center text-[10px] -right-2 -top-2 bg-black w-4 h-4 text-white">
              {cart.length}
            </div>
            <ShopingLogo />
          </a>

          <a href="#" className="hover:text-gray-500 transition-colors">
            <PeopleLogo />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
