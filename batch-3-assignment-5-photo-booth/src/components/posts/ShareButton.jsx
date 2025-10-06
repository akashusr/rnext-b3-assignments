import { GoShareAndroid } from "react-icons/go";
import Button from "../ui/Button";
import { toast } from "react-toastify";

const ShareButton = ({ post }) => {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://photo-booth-feed.netlify.app/posts/${post._id}`
      );
      toast.success("Post link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy post link");
      console.error(error);
    }
  };
  return (
    <Button onClick={handleShare}>
      <GoShareAndroid size={20} />
    </Button>
  );
};

export default ShareButton;
