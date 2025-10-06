import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const ProductDetailsBreadcrumb = ({ name }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href={"/"} className="text-gray-500 hover:text-primary-600">
              Home
            </Link>
          </li>
          <li>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="text-gray-400 text-xs"
            />
          </li>
          <li>
            <Link
              href={"/products?page=1"}
              className="text-gray-500 hover:text-primary-600"
            >
              Products
            </Link>
          </li>
          <li>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="text-gray-400 text-xs"
            />
          </li>
          <li className="text-gray-900 dark:text-white">{name}</li>
        </ol>
      </nav>
    </div>
  );
};

export default ProductDetailsBreadcrumb;
