import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";

const ForgetHero = () => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-primary-500 p-3 rounded-full">
          <FontAwesomeIcon icon={faKey} className="text-white text-2xl" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Reset your password
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Enter your email address and we&apos;ll send you a link to reset your
        password
      </p>
    </div>
  );
};

export default ForgetHero;
