import { Navigate, Outlet } from "react-router";
import Sidebar from "../components/shared/Sidebar";
import { useAuth } from "../stores/useAuth";

const AuthLayout = () => {
  const { accessToken } = useAuth((state) => state);

  return accessToken ? (
    <section>
      <Sidebar />

      <Outlet />
    </section>
  ) : (
    <Navigate to={"/login"} />
  );
};

export default AuthLayout;
