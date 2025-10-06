import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

const ProductsPagination = ({
  page,
  totalPages,
  category,
  price,
  q,
  location,
  organic,
}) => {
  // Build URL params helper function
  const buildUrl = (pageNum) => {
    const params = new URLSearchParams();
    params.set("page", pageNum.toString());

    if (category) {
      params.set("category", category);
    }
    if (price) {
      params.set("price", price);
    }
    if (q) {
      params.set("q", q);
    }
    if (location) {
      params.set("location", location);
    }
    if (organic) {
      params.set("organic", organic);
    }

    return `/products?${params.toString()}`;
  };

  if (page > totalPages) {
    redirect(buildUrl(totalPages));
  }

  let nextPage = Math.min(parseInt(page) + 1, totalPages);
  let prevPage = Math.max(parseInt(page) - 1, 1);
  //   console.log("prevPage:", prevPage);
  //   console.log("Currentpage:", page);
  //   console.log("nextPage:", nextPage);

  // console.log("Total Pages:", totalPages);
  return (
    <div className="flex justify-center mt-12">
      <nav aria-label="Pagination">
        <ul className="inline-flex items-center -space-x-px text-gray-600 dark:text-gray-300">
          <li>
            <Link
              href={buildUrl(prevPage)}
              className={`block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                page <= 1 ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </Link>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index + 1}>
              <Link
                href={buildUrl(index + 1)}
                className={`px-3 py-2 leading-tight ${
                  page === index + 1
                    ? "text-white bg-primary-600 border border-primary-600 hover:bg-primary-700 hover:text-white"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                {index + 1}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={buildUrl(nextPage)}
              className={`block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                page >= totalPages ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ProductsPagination;
