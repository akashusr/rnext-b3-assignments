import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const EmailConfirmation = () => {
  return (
    <div className="mt-8 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faEnvelope}
          className="text-blue-600 dark:text-blue-400 mr-3"
        />
        <div>
          <p className="font-medium text-blue-900 dark:text-blue-100">
            Email Confirmation Sent
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            We&apos;ve sent your order confirmation and receipt to your email
            address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
