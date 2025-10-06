import useCurrentUser from "./useCurrentUser";

export const useAvatar = (post) => {
  const user = useCurrentUser();

  const isMe = post?.userId === user?.id;
  const avatar = isMe ? `${user?.avatar}` : `${post?.user?.avatar}`;

  const avatarURL = `${import.meta.env.VITE_SERVER_BASE_URL}/${avatar}`;
  const getAvatar = (url) => {
    return url && url.startsWith("https://lh3.googleusercontent")
      ? url
      : `${import.meta.env.VITE_SERVER_BASE_URL}/${url}`;
  };

  return { avatarURL, getAvatar };
};
