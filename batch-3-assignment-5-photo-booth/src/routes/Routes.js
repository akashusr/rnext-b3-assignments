import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import AuthLayout from "../layouts/AuthLayout";
import CreatePostPage from "../pages/private/CreatePost";
import NotificationPage from "../pages/private/Notification";
import ProfilePage from "../pages/private/Profile";
import PostDetailsPage from "../pages/private/PostDetails";
import HomePage from "../pages/Home";
import EditProfilePage from "../pages/private/EditProfile";
import UserProfile from "../pages/UserProfile";
import SavedPosts from "../pages/private/SavedPosts";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        path: "/",
        Component: HomePage,
      },
      {
        path: "/",
        Component: HomePage,
      },
      {
        path: "/posts/:postId",
        Component: PostDetailsPage,
      },
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/register",
        Component: RegisterPage,
      },
    ],
  },

  // auth protected routes
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "/create-post",
        Component: CreatePostPage,
      },

      {
        path: "/notifications",
        Component: NotificationPage,
      },
      {
        path: "/saved",
        Component: SavedPosts,
      },
      {
        path: "/profile",
        Component: ProfilePage,
      },
      {
        path: "/profile/:userId",
        Component: UserProfile,
      },
      {
        path: "/edit-profile",
        Component: EditProfilePage,
      },
    ],
  },
]);

export default router;
