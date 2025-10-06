import ImgLogo from "/logo.svg";

export default function HeaderLogo() {
  return (
    <a href="#" className="flex items-center">
      <img src={ImgLogo} className="mr-3 h-6 sm:h-9" alt="Landwind Logo" />
      <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
        Learn with Sumit
      </span>
    </a>
  );
}
