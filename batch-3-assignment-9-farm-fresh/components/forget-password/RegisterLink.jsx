import Link from "next/link";
import React from "react";

const RegisterLink = () => {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?
        <Link
          href="/register"
          className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          Create account
        </Link>
      </p>
    </div>
  );
};

export default RegisterLink;
