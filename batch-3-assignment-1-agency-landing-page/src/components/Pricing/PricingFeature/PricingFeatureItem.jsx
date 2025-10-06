import IconCheck from "../../UI/Icons/IconCheck";

export default function PricingFeatureItem({ children }) {
  return (
    <li className="flex items-center space-x-3">
      <IconCheck className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400" />
      {children}
    </li>
  );
}
