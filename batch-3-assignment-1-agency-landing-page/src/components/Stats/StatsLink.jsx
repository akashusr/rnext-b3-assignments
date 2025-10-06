import IconArrow from "../UI/Icons/IconArrow";

export default function StatsLink({ label }) {
  return (
    <div>
      <a
        href="#"
        className="inline-flex items-center text-base font-medium text-purple-600 hover:text-purple-800 dark:text-purple-500 dark:hover:text-purple-700"
      >
        {label}
        <IconArrow className="ml-1 h-5 w-5" />
      </a>
    </div>
  );
}
