import Link from "next/link";
const NotFound = () => {
  return (
    <div className="flex flex-col gap-3 items-center justify-center h-screen w-full">
      <span className="font-semibold text-2xl text-red-500">
        404 page not found
      </span>
      <Link
        href="/news"
        className="px-3 py-1 bg-blue-400 text-white rounded-2xl"
      >
        Go back home
      </Link>
    </div>
  );
};
export default NotFound;
