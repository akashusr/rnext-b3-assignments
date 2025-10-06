"use client";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

// Props: currentPage, totalPages. Renders links that preserve other search params.
const OrdersPagination = ({ currentPage = 1, totalPages = 1 }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const toPageHref = (p) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (!p || p === 1) {
      params.delete("page");
    } else {
      params.set("page", String(p));
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const pages = [];
  const maxToShow = 5;
  const start = Math.max(1, currentPage - Math.floor(maxToShow / 2));
  const end = Math.min(totalPages, start + maxToShow - 1);
  const adjStart = Math.max(1, Math.min(start, end - maxToShow + 1));
  for (let i = adjStart; i <= end; i++) pages.push(i);

  return (
    <div className="flex justify-center mt-12">
      <nav aria-label="Pagination">
        <ul className="inline-flex items-center -space-x-px text-gray-600 dark:text-gray-300">
          <li>
            <Link
              href={toPageHref(Math.max(1, currentPage - 1))}
              className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </Link>
          </li>
          {pages[0] > 1 && (
            <li>
              <Link
                href={toPageHref(1)}
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                1
              </Link>
            </li>
          )}
          {pages[0] > 2 && (
            <li>
              <span className="px-3 py-2 leading-tight text-gray-400">…</span>
            </li>
          )}
          {pages.map((p) => (
            <li key={p}>
              <Link
                href={toPageHref(p)}
                className={
                  p === currentPage
                    ? "px-3 py-2 leading-tight text-white bg-primary-600 border border-primary-600 hover:bg-primary-700 hover:text-white"
                    : "px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                }
              >
                {p}
              </Link>
            </li>
          ))}
          {pages[pages.length - 1] < totalPages - 1 && (
            <li>
              <span className="px-3 py-2 leading-tight text-gray-400">…</span>
            </li>
          )}
          {pages[pages.length - 1] < totalPages && (
            <li>
              <Link
                href={toPageHref(totalPages)}
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                {totalPages}
              </Link>
            </li>
          )}
          <li>
            <Link
              href={toPageHref(Math.min(totalPages, currentPage + 1))}
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

export default OrdersPagination;
