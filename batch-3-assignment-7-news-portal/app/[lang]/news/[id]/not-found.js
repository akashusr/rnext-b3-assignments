"use client";
import { useParams, useRouter } from "next/navigation";


const NotFound = () => {
  const articleId = 0;
  const params = useParams();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col gap-3 items-center h-screen w-full justify-center ">
      <p className="text-center text-red-500">
        This News with {params.id} id was not found!
      </p>
      <button
        onClick={handleBack}
        className="px-3 py-1 bg-blue-400 text-white rounded-2xl"
      >
        Go back
      </button>
    </div>
  );
};
export default NotFound;
