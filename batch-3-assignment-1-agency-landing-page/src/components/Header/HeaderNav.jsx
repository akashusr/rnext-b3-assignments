import HeaderNavItem from "../Header/HeaderNavItem";

const navLinkItem = [
  {
    id: "fdc9502c-8cd9-5422-b87e-8eeb5435d4c1",
    to: "#",
    label: "Home",
    isActive: true,
  },
  { id: "4ae8233b-470a-524a-b716-15ac2b77439c", to: "#", label: "Company" },
  { id: "6b727716-c571-5054-9e5d-e4ed6581eefd", to: "#", label: "Marketplace" },
  { id: "84dcd7ae-5ee9-55d3-8619-49dceca4c792", to: "#", label: "Features" },
  { id: "90ea3799-66b4-5706-9055-d145503fb53d", to: "#", label: "Team" },
  { id: "bdbbc674-f5e7-5805-8a42-7cb2be6f0708", to: "#", label: "Contact" },
];

export default function HeaderNav() {
  return (
    <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
      {navLinkItem.map((navLink) => (
        <HeaderNavItem key={navLink.id} {...navLink} />
      ))}
    </ul>
  );
}
