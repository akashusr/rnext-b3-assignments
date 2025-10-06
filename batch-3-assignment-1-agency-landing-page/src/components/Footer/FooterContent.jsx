import ImgLogo from "/logo.svg";

export default function FooterContent() {
  return (
    <>
      <a
        href="#"
        className="mb-5 flex items-center justify-center text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img
          src={ImgLogo}
          className="mr-3 h-6 sm:h-9"
          alt="Learn with Sumit Logo"
        />
        Learn with Sumit{" "}
      </a>
      <span className="block text-center text-sm text-gray-500 dark:text-gray-400">
        © 2024-2025 Learn with Sumit. All Rights Reserved. Built with{" "}
        <a
          href="#"
          target="_blank"
          className="text-purple-600 hover:underline dark:text-purple-500"
        >
          Flowbite
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="text-purple-600 hover:underline dark:text-purple-500"
        >
          Tailwind CSS
        </a>
        .
      </span>
    </>
  );
}
