export default function Button({ type, to, children }) {
  return (
    <a
      href={to}
      target="_blank"
      className={`rounded-lg text-sm font-medium focus:ring-4 ${
        type === "primary"
          ? "bg-purple-700 px-4 py-2 text-white hover:bg-purple-800 focus:ring-purple-300 focus:outline-none sm:mr-2 lg:mr-0 lg:px-5 lg:py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
          : ""
      } ${
        type === "secondary"
          ? "mr-2 mb-2 inline-flex w-full items-center justify-center border border-gray-200 bg-white px-5 py-3 text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-gray-200 focus:outline-none sm:w-auto dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          : ""
      } ${
        type === "outline"
          ? "inline-flex w-full items-center justify-center border border-gray-200 px-5 py-3 text-center text-gray-900 hover:bg-gray-100 focus:ring-gray-100 sm:w-auto dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          : ""
      }`}
    >
      {children}
    </a>
  );
}
