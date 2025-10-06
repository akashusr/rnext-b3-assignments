import ImgAvatar from "../../assets/images/avatar/michael-gouch.png";

export default function TestimonialAuthor() {
  return (
    <figcaption className="mt-6 flex items-center justify-center space-x-3">
      <img
        className="h-6 w-6 rounded-full"
        src={ImgAvatar}
        alt="profile picture"
      />
      <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
        <div className="pr-3 font-medium text-gray-900 dark:text-white">
          Micheal Gough
        </div>
        <div className="pl-3 text-sm font-light text-gray-500 dark:text-gray-400">
          CEO at Google
        </div>
      </div>
    </figcaption>
  );
}
