import Link from "next/link";
const links = [
  {
    id: crypto.randomUUID(),
    text: "Help",
    link: "/"
  },
  {
    id: crypto.randomUUID(),
    text: "Status",
    link: "/"
  },
  {
    id: crypto.randomUUID(),
    text: "Writers",
    link: "/"
  },
  {
    id: crypto.randomUUID(),
    text: "Blog",
    link: "/"
  },
  {
    id: crypto.randomUUID(),
    text: "Careers",
    link: "/"
  },
  {
    id: crypto.randomUUID(),
    text: "Privacy",
    link: "/"
  },
  {
    id: crypto.randomUUID(),
    text: "Terms",
    link: "/"
  },
  {
    id: crypto.randomUUID(),
    text: "About",
    link: "/"
  }
];
const FooterLinks = () => {
  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <div className="flex flex-wrap text-sm text-gray-500 gap-x-4 gap-y-2">
        {links.map(link => (
          <Link key={link.id} href={link.link}>{link.text}</Link>
        ))}
      </div>
    </div>
  );
};

export default FooterLinks;
