import { useState } from "react";
import Dialog from "./Dialog";
import { CiLock } from "react-icons/ci";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import Button from "../ui/Button";
import { useModal } from "../../stores/useModal";

const AuthDialog = ({ description }) => {
  const [authState, setAuthState] = useState("login");
  const { closeModal } = useModal();

  return (
    <Dialog>
      <div className="success-icon mb-6 bg-[#0095f6]">
        <CiLock size={34} color="#ffffff" stroke="2" />
      </div>
      <h3 className="text-xl font-semibold text-center mb-2">
        Authentication Required
      </h3>
      <p className="text-gray-500 text-center mb-6">
        {description ?? "Please log in to continue."}
      </p>

      {authState === "login" ? (
        <LoginForm onLoginSuccess={() => closeModal()} />
      ) : (
        <RegisterForm />
      )}

      {authState === "login" ? (
        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Button
            className="text-blue-500 font-semibold"
            onClick={() => setAuthState("register")}
          >
            Sign up
          </Button>
        </p>
      ) : (
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Button
            className="text-blue-500 font-semibold"
            onClick={() => setAuthState("login")}
          >
            Log in
          </Button>
        </p>
      )}
    </Dialog>
  );
};

export default AuthDialog;
