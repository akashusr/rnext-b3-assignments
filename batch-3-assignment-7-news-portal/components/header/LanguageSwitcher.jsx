"use client";
import { usePathname } from "next/navigation";
import redirectHard from "@/utils/redirect";
import Button from "@/components/Button";
const LanguageSwitcher = ({ lang }) => {
  const pathname = usePathname();

  const handleSwitch = locale => {
   

    document.cookie = `lang=${locale}; path=/; max-age=31536000`;

    const newPath = pathname.replace(/^\/(en|bn)/, `/${locale}`);

    redirectHard(newPath);
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <Button styles={lang === "en"} onSmash={() => handleSwitch("en")}>
        EN
      </Button>
      <span className="text-gray-400">|</span>
      <Button styles={lang === "bn"} onSmash={() => handleSwitch("bn")}>
        বাং
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
