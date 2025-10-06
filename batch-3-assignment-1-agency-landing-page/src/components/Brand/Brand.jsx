import IconAirbnb from "../UI/Icons/IconAirbnb";
import IconGoogle from "../UI/Icons/IconGoogle";
import IconMailChimp from "../UI/Icons/IconMailChimp";
import IconMashable from "../UI/Icons/IconMashable";
import IconMicrosoft from "../UI/Icons/IconMicrosoft";
import IconSpotify from "../UI/Icons/IconSpotify";
import BrandItem from "./BrandItem";

export default function Brand() {
  const brandIconClassName = "h-9 hover:text-gray-900 dark:hover:text-white";

  const brandList = [
    <IconAirbnb className={brandIconClassName} />,
    <IconGoogle className={brandIconClassName} />,
    <IconMicrosoft className={brandIconClassName} />,
    <IconSpotify className={brandIconClassName} />,
    <IconMailChimp className={brandIconClassName} />,
    <IconMashable className={brandIconClassName} />,
  ];

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 pb-8 lg:pb-16">
        <div className="grid grid-cols-2 gap-8 text-gray-500 sm:grid-cols-3 sm:gap-12 lg:grid-cols-6 dark:text-gray-400">
          {brandList.map((brand, index) => (
            <BrandItem icon={brand} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
