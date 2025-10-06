import { Outlet } from "react-router";
import { useModal } from "../stores/useModal";
import PostLikesDialog from "../components/dialog/PostLikesDialog";
import AuthDialog from "../components/dialog/AuthDialog";

const RootLayout = () => {
  const { isOpen, activePost, authError } = useModal();

  return (
    <>
      <Outlet />
      {isOpen && activePost && <PostLikesDialog likes={activePost?.likes} />}
      {isOpen && authError?.message && (
        <AuthDialog
          description={
            authError?.source === "login"
              ? "Login is required to like a post."
              : "Please log in to continue."
          }
        />
      )}
    </>
  );
};

export default RootLayout;
