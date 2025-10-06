import PricingCardList from "./PricingCard/PricingCardList";
import PricingContent from "./PricingContent";

export default function Pricing() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-24">
        <PricingContent />
        <PricingCardList />
      </div>
    </section>
  );
}
