import Button from "../../UI/Button.jsx";
import PricingQuantityFeatureList from "../PricingFeature/PricingQuantityFeatureList.jsx";
import PricingTextFeatureItem from "../PricingFeature/PricingTextFeatureItem.jsx";

export default function PricingCardItem({
  title,
  description,
  price,
  textFeatureList,
  quantityFeatureList,
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col rounded-lg border border-gray-100 bg-white p-6 text-center text-gray-900 shadow xl:p-8 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
      <h3 className="mb-4 text-2xl font-semibold">{title}</h3>
      <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
        {description}
      </p>
      <div className="my-8 flex items-baseline justify-center">
        <span className="mr-2 text-5xl font-extrabold">${price}</span>
        <span className="text-gray-500 dark:text-gray-400">/month</span>
      </div>

      <ul role="list" className="mb-8 space-y-4 text-left">
        {textFeatureList.map((feature) => (
          <PricingTextFeatureItem label={feature} key={feature} />
        ))}

        <PricingQuantityFeatureList quantityFeatureList={quantityFeatureList} />
      </ul>

      <Button type="primary">Get started</Button>
    </div>
  );
}
