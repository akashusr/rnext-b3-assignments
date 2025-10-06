import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/utils/dictionaries";
const Logo = async ({ lang }) => {
  const dict = await getDictionary(lang);

  return (
    <div className="flex gap-2 items-center">
      <Link href="/" className="flex items-center">
        <Image
          src="/assets/logo.png"
          alt="Logo"
          className="w-8 h-8 inline-block mr-2"
          width={32}
          height={32}
        />
        <h1 className="text-xl font-bold tracking-wider">{dict.websiteName}</h1>
      </Link>
    </div>
  );
};

export default Logo;
