export default function FooterSocial({ to, icon }) {
  return (
    <li>
      <a
        href={to}
        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        {icon}
      </a>
    </li>
  );
}
