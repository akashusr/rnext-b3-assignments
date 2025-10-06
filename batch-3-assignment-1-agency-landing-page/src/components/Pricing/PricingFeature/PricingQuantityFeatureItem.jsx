import PricingFeatureItem from "./PricingFeatureItem";

export default function PricingQuantityFeatureItem({ label, quantity, unit }) {
  return (
    <PricingFeatureItem>
      <span>
        {label}: {quantity} {unit}
      </span>
    </PricingFeatureItem>
  );
}
