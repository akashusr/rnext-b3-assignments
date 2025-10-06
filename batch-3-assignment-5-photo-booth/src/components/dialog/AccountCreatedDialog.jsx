import { FaCheck } from "react-icons/fa6";
import Button from "../ui/Button";
import Dialog from "./Dialog";
import { useNavigate } from "react-router";
import { useModal } from "../../stores/useModal";

const AccountCreatedDialog = () => {
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const handleRedirect = (path) => {
    closeModal();
    navigate(path);
  };

  return (
    <Dialog>
      <div className="success-icon">
        <FaCheck size={32} color="white" />
      </div>
      <h3 className="text-xl font-semibold text-center mb-2">
        Account Created
      </h3>
      <p className="text-gray-500 dark:text-slate-400 text-center mb-6">
        Your PhotoBooth account has been created successfully.
      </p>
      <Button
        className="primary-button mb-3"
        onClick={() => handleRedirect("/")}
      >
        Continue to Feed
      </Button>
      <Button
        className="secondary-button"
        onClick={() => handleRedirect("/edit-profile")}
      >
        Complete Your Profile
      </Button>
    </Dialog>
  );
};

export default AccountCreatedDialog;
