import PostCard from "./PostCard";

const PostFeed = ({ posts }) => {
  return (
    <>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </>
  );
};

export default PostFeed;
