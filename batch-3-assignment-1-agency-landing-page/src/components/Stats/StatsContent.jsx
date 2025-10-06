import StatsLink from "./StatsLink";

export default function StatsContent() {
  return (
    <div className="col-span-2 mb-8">
      <p className="text-lg font-medium text-purple-600 dark:text-purple-500">
        Trusted Worldwide
      </p>
      <h2 className="mt-3 mb-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-3xl dark:text-white">
        Trusted by over 600 million users and 10,000 teams
      </h2>
      <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
        Our rigorous security and compliance standards are at the heart of all
        we do. We work tirelessly to protect you and your customers.
      </p>
      <div className="mt-6 space-y-4 border-t border-gray-200 pt-6 dark:border-gray-700">
        <StatsLink label="Explore Legality Guide" />
        <StatsLink label="Visit the Trust Center" />
      </div>
    </div>
  );
}
