export default function HeaderNavItem({ to, label, isActive }) {
  return (
    <li>
      <a
        href={to}
        className={`block py-2 pr-4 pl-3 lg:p-0 ${isActive ? "rounded bg-purple-700 text-white lg:bg-transparent lg:text-purple-700 dark:text-white" : "border-b border-gray-100 text-gray-700 hover:bg-gray-50 lg:border-0 lg:hover:bg-transparent lg:hover:text-purple-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent lg:dark:hover:text-white"}`}
      >
        {label}
      </a>
    </li>
  );
}
