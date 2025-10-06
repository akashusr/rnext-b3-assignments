import React from "react";
import { FaCheck } from "react-icons/fa6";
import Button from "../ui/Button";
import Dialog from "./Dialog";

const SuccessDialog = () => {
  return (
    <Dialog>
      <div className="success-icon">
        <FaCheck size={32} color="white" />
      </div>
      <h3 className="text-xl font-semibold text-center mb-2">Success!</h3>
      <p className="text-gray-500 text-center mb-6">
        Your post has been shared successfully.
      </p>
      <Button className="primary-button mb-3">Continue</Button>
    </Dialog>
  );
};

export default SuccessDialog;
