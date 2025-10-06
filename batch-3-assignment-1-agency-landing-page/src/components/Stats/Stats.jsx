import StatsContent from "./StatsContent";
import StatsItemList from "./StatsItemList";

export default function Stats() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl items-center px-4 py-8 lg:grid lg:grid-cols-4 lg:gap-16 lg:px-6 lg:py-24 xl:gap-24">
        <StatsContent />
        <StatsItemList />
      </div>
    </section>
  );
}
