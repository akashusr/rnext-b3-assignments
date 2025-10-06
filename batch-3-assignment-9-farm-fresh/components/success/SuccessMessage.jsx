import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const SuccessMessage = () => {
  return (
    <div className="text-center mb-12">
      <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 dark:bg-green-900 mb-6">
        <FontAwesomeIcon
          icon={faCheck}
          className="text-4xl text-green-600 dark:text-green-400"
        />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Payment Successful!
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
        Thank you for your order
      </p>
      <p className="text-gray-500 dark:text-gray-500">Order #FB-2024-001234</p>
    </div>
  );
};

export default SuccessMessage;
