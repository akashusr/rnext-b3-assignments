import Dialog from "./Dialog";
import Button from "../ui/Button";
import { CiLock } from "react-icons/ci";
import { useModal } from "../../stores/useModal";

const PasswordUpdatedDialog = () => {
  const { closeModal } = useModal();
  return (
    <Dialog>
      <div className="success-icon mb-6 bg-[#0095f6]">
        <CiLock size={34} color="#ffffff" stroke="2" />
      </div>
      <h3 className="text-xl font-semibold text-center mb-2">
        Password Updated
      </h3>
      <p className="text-gray-500 dark:text-slate-400 text-center mb-6">
        Your password has been changed successfully. You'll be logged out from
        all other devices.
      </p>
      <Button className="primary-button" onClick={closeModal}>
        OK
      </Button>
    </Dialog>
  );
};

export default PasswordUpdatedDialog;
