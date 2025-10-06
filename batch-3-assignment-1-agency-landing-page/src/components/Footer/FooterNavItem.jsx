import FooterNavLink from "./FooterNavLink";

export default function FooterNavItem({ nav }) {
  return (
    <div>
      <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
        {nav.category}
      </h3>
      <ul className="text-gray-500 dark:text-gray-400">
        {nav.links.map((link) => (
          <FooterNavLink link={link} key={link.id} />
        ))}
      </ul>
    </div>
  );
}
