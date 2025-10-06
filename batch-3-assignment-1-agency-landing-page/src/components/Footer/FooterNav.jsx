import FooterNavItem from "./FooterNavItem";

const navList = [
  {
    id: "7435a59f-934a-5f4d-95ef-de2eb175a06e",
    category: "Company",
    links: [
      { id: "1024f81b-fc12-59f0-82e2-3c8dfb383e5d", label: "About", to: "#" },
      { id: "14f0037c-db5c-5ace-8d0d-d55af87b6436", label: "Careers", to: "#" },
      {
        id: "1dd90e53-9c95-59de-97d1-c0f938a0cc58",
        label: "Brand Center",
        to: "#",
      },
      { id: "2ec3e2f0-8713-5ef7-b182-147af2cd04b9", label: "Blog", to: "#" },
    ],
  },
  {
    id: "bc8a440c-d631-5b3b-9998-22270d836537",
    category: "Help Center",
    links: [
      {
        id: "a569043e-4fdd-5b2c-a8e2-8a3d1935fc30",
        label: "Discord Server",
        to: "#",
      },
      { id: "bfd4eb79-2729-5ec4-b1b6-914f1b1d2171", label: "Twitter", to: "#" },
      {
        id: "622414f7-93d6-56f9-8236-fdaa12d760ac",
        label: "Facebook",
        to: "#",
      },
      {
        id: "c70e222a-52d4-58de-ba62-e91fbb0ddca8",
        label: "Contact Us",
        to: "#",
      },
    ],
  },
  {
    id: "2359e768-725c-53a4-91d8-ebb0aee01c80",
    category: "Legal",
    links: [
      {
        id: "2a8deb38-791c-589e-9fb7-000e1799356b",
        label: "Privacy Policy",
        to: "#",
      },
      {
        id: "dae0e35e-97db-553e-9826-c65d25617cbd",
        label: "Licensing",
        to: "#",
      },
      { id: "e9e65fb1-b7cc-5114-b27f-97b3833b9be8", label: "Terms", to: "#" },
    ],
  },
  {
    id: "8fe388d0-ac37-53ed-b9c3-ad20021ada15",
    category: "Company",
    links: [
      { id: "9ea44bf4-80dc-52d2-ba5b-d1efc1155716", label: "About", to: "#" },
      { id: "2770051a-e8be-5429-b48c-cfbfdde09820", label: "Careers", to: "#" },
      {
        id: "aeb415cc-3e16-5149-8938-271b97406fac",
        label: "Brand Center",
        to: "#",
      },
      { id: "087dc9b5-d31d-5fd4-a56e-78a3657769fb", label: "Blog", to: "#" },
    ],
  },
  {
    id: "d674dd69-4cec-5edc-b2fa-a55e6717e4cb",
    category: "Download",
    links: [
      { id: "f6fb5a42-ae4c-5a0c-9288-88532d18c90b", label: "iOS", to: "#" },
      { id: "3c8d0ad0-8544-57d5-ad7e-7bdb90685aec", label: "Android", to: "#" },
      { id: "d6c4f7cd-c1ab-5e68-96ea-9fbf532aeda3", label: "Windows", to: "#" },
      { id: "c090e13b-bf79-53a0-9f9a-9a810a4a5f9d", label: "MacOS", to: "#" },
    ],
  },
];

export default function FooterNav() {
  return (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
      {navList.map((nav) => (
        <FooterNavItem nav={nav} key={nav.id} />
      ))}
    </div>
  );
}
