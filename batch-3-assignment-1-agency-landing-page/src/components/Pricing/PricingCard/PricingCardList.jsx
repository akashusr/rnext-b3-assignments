import PricingCardItem from "./PricingCardItem";

const pricingList = [
  {
    id: "08464785-e922-5c72-a5d7-0a8926e6c13e",
    title: "Starter",
    description: "Best option for personal use & for your next project.",
    price: 29,
    features: {
      text: ["Individual configuration", "No setup, or hidden fees"],
      quantity: { team: 1, support: 6, updates: 6 },
    },
  },
  {
    id: "1bfec4df-c7fb-5066-bd2c-f50039c7ae07",
    title: "Company",
    description: "Relevant for multiple users, extended & premium support.",
    price: 99,
    features: {
      text: ["Individual configuration", "No setup, or hidden fees"],
      quantity: { team: 10, support: 24, updates: 24 },
    },
  },
  {
    id: "40e1d3f8-802c-5e3f-b67f-14ff00ff8606",
    title: "Enterprise",
    description:
      "Best for large scale uses and extended redistribution rights.",
    price: 499,
    features: {
      text: ["Individual configuration", "No setup, or hidden fees"],
      quantity: { team: "100+", support: 36, updates: 36 },
    },
  },
];

export default function PricingCardList() {
  return (
    <div className="space-y-8 sm:gap-6 lg:grid lg:grid-cols-3 lg:space-y-0 xl:gap-10">
      {pricingList.map((pricing) => (
        <PricingCardItem
          key={pricing.id}
          title={pricing.title}
          description={pricing.description}
          price={pricing.price}
          textFeatureList={pricing.features.text}
          quantityFeatureList={pricing.features.quantity}
        />
      ))}
    </div>
  );
}
