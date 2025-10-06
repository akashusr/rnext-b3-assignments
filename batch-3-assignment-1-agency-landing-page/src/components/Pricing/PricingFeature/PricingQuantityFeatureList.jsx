import { unit } from "../../../utils/unit";
import PricingQuantityFeatureItem from "./PricingQuantityFeatureItem.jsx";

export default function PricingQuantityFeatureList({ quantityFeatureList }) {
  return Object.keys(quantityFeatureList).map((key) => {
    const quantity = quantityFeatureList[key];

    switch (key) {
      case "team":
        return (
          <PricingQuantityFeatureItem
            key={key}
            label={"Team Size"}
            unit={unit("developer", quantity)}
            quantity={quantity}
          />
        );

      case "support":
        return (
          <PricingQuantityFeatureItem
            key={key}
            label={"Premium support"}
            unit={unit("month", quantity)}
            quantity={quantity}
          />
        );

      case "updates":
        return (
          <PricingQuantityFeatureItem
            key={key}
            label={"Free updates"}
            unit={unit("month", quantity)}
            quantity={quantity}
          />
        );
    }
  });
}
