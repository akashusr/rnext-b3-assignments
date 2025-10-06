export default function FooterNavLink({ link }) {
  return (
    <li className="mb-4">
      <a href={link.to} className="hover:underline">
        {link.label}
      </a>
    </li>
  );
}
