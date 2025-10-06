import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faI, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const AdditionalHelp = () => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
        <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
        Need help?
      </h3>
      <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
        <p>• Check your spam/junk folder if you don&apos;t receive the email</p>
        <p>• Make sure you entered the correct email address</p>
        <p>• Contact support if you continue having issues</p>
      </div>
      <div className="mt-3">
        <a
          href="#"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default AdditionalHelp;
