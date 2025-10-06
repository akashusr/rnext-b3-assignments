import { signInWithPopup } from "firebase/auth";

import { auth, googleProvider } from "../lib/firebase.config";
import axios from "axios";
import { useAuth } from "../stores/useAuth";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const useSocialLogin = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const payload = {
        email: firebaseUser.email,
        password: firebaseUser.uid, // Firebase UID as password since backend doesn't support social login
        name: firebaseUser.displayName,
        avatar: firebaseUser.photoURL,
      };

      // Try logging in
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/login`,
          {
            email: payload.email,
            password: payload.password,
          }
        );

        useAuth.getState().setToken({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        useAuth.getState().setUser(data.user);
        navigate("/");
      } catch (loginError) {
        // If login fails, attempt signup
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/signup`,
            payload
          );

          useAuth.getState().setToken({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
          useAuth.getState().setUser(data.user);
          navigate("/");
        } catch (signupError) {
          console.error("Signup failed:", signupError);
          toast.error(
            signupError?.response?.data?.message || "Something went wrong"
          );
        }
      }
    } catch (error) {
      console.error("Firebase sign-in failed:", error);
      toast.error("Firebase sign-in failed.");
    }
  };

  return { handleGoogleLogin };
};

export default useSocialLogin;
