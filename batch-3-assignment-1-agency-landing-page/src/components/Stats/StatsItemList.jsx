import IconCart from "../UI/Icons/IconCart";
import IconPeople from "../UI/Icons/IconPeople";
import IconServer from "../UI/Icons/IconServer";
import IconWorld from "../UI/Icons/IconWorld";
import StatsItem from "./StatsItem";

export default function StatsItemList() {
  const statsItemClassName =
    "mb-2 h-10 w-10 text-purple-600 md:h-12 md:w-12 dark:text-purple-500";

  return (
    <div className="col-span-2 space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
      <StatsItem
        icon={<IconServer className={statsItemClassName} />}
        title="99.99% uptime"
        description="For Landwind, with zero maintenance downtime"
      />

      <StatsItem
        icon={<IconPeople className={statsItemClassName} />}
        title="600M+ Users"
        description="Trusted by over 600 milion users around the world"
      />

      <StatsItem
        icon={<IconWorld className={statsItemClassName} />}
        title="100+ countries"
        description="Have used Landwind to create functional websites"
      />

      <StatsItem
        icon={<IconCart className={statsItemClassName} />}
        title="5+ Million"
        description="Transactions per day"
      />
    </div>
  );
}
