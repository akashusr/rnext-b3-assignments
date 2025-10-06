import ShareIcon from "../icons/ShareIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import ClockIcon from "../icons/ClockIcon";
const SocialActions = ({ readTime, dict }) => {
  const { minutes, seconds } = readTime;
  return (
    <div className="flex items-center space-x-6 mb-8">
      <button className="flex items-center space-x-2 text-sm hover:text-gray-600 transition-colors">
        <ShareIcon />
        <span>{dict.share}</span>
      </button>

      <button className="flex items-center space-x-2 text-sm hover:text-gray-600 transition-colors">
        <BookmarkIcon />
        <span>{dict.bookmark}</span>
      </button>

      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <ClockIcon />
        <span>
          {`${minutes > 0 ? minutes + "m" : ""} ${seconds}s
              read`}
        </span>
      </div>
    </div>
  );
};

export default SocialActions;
