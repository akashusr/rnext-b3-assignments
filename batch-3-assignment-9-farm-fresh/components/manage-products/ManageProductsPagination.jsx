import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Link from "next/link";

const ManageProductsPagination = ({ pagination }) => {
  const { currentPage = 1, totalPages = 0 } = pagination || {};
  if (!totalPages || totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-center mt-12">
      <nav aria-label="Pagination">
        <ul className="inline-flex items-center -space-x-px text-gray-600 dark:text-gray-300">
          <li>
            <Link
              href={`?page=${Math.max(1, currentPage - 1)}`}
              className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </Link>
          </li>
          {pages.map((p) => (
            <li key={p}>
              <Link
                href={`?page=${p}`}
                className={`px-3 py-2 leading-tight border ${
                  p === currentPage
                    ? "text-white bg-primary-600 border-primary-600 hover:bg-primary-700 hover:text-white"
                    : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                {p}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={`?page=${Math.min(totalPages, currentPage + 1)}`}
              className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ManageProductsPagination;
