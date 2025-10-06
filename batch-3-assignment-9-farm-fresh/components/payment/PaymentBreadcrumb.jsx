import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const PaymentBreadcrumb = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <a href="/" className="text-gray-500 hover:text-primary-600">
              Home
            </a>
          </li>
          <li>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="text-gray-400 text-xs"
            />
          </li>
          <li>
            <a href="#" className="text-gray-500 hover:text-primary-600">
              Product Details
            </a>
          </li>
          <li>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="text-gray-400 text-xs"
            />
          </li>
          <li className="text-gray-900 dark:text-white">Payment</li>
        </ol>
      </nav>
    </div>
  );
};

export default PaymentBreadcrumb;
