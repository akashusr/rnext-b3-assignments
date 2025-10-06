import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import { getDictionary } from "@/utils/dictionaries.js";

const NavLists = async ({ lang }) => {
  const dict = await getDictionary(lang);
  
  return (
    <nav className="hidden md:flex items-center space-x-6">
      {dict.navLists?.map(list => (
        <Link
          key={list.id}
          href={list.path}
          className="text-sm hover:text-gray-600 transition-colors"
        >
          {list.name}
        </Link>
      ))}

      <LanguageSwitcher lang={lang} />
    </nav>
  );
};

export default NavLists;
