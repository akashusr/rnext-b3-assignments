import { getDictionary } from "@/utils/dictionaries";
const MarqueeBanner = async ({ lang }) => {
  const dict = await getDictionary(lang);
  return (
    <div className="bg-black text-white py-3 overflow-hidden">
      <div className="marquee whitespace-nowrap">
        <span className="text-sm">
          {dict.bannerText}
        </span>
      </div>
    </div>
  );
};

export default MarqueeBanner;
