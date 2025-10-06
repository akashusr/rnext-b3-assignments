import IconFacebook from "../UI/Icons/IconFacebook";
import IconGitHub from "../UI/Icons/IconGitHub.jsx";
import IconInstagram from "../UI/Icons/IconInstagram.jsx";
import IconTwitter from "../UI/Icons/IconTwitter.jsx";
import IconWeb from "../UI/Icons/IconWeb.jsx";
import FooterSocial from "./FooterSocial";

const iconClassName = "w-5 h-5";

const socials = [
  {
    id: "797a9ce7-87bb-52d3-8771-142b21ff5f34",
    icon: <IconFacebook className={iconClassName} />,
    to: "#",
  },
  {
    id: "9a369c87-3110-5beb-82ea-af1e589cff56",
    icon: <IconInstagram className={iconClassName} />,
    to: "#",
  },
  {
    id: "81cb708b-f8b0-52cc-891b-99f9a17d385b",
    icon: <IconTwitter className={iconClassName} />,
    to: "#",
  },
  {
    id: "8ce321cb-f469-5b17-bbc7-00336f3114a9",
    icon: <IconGitHub className={iconClassName} />,
    to: "#",
  },
  {
    id: "d9cc0af0-a06e-5ad3-a151-715539b3822b",
    icon: <IconWeb className={iconClassName} />,
    to: "#",
  },
];

export default function FooterSocialList() {
  return (
    <ul className="mt-5 flex justify-center space-x-5">
      {socials.map((social) => (
        <FooterSocial key={social.id} icon={social.icon} to={social.to} />
      ))}
    </ul>
  );
}
