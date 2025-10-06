import React from "react";

const ManageBreadcrumb = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <a href="index.html" className="text-gray-500 hover:text-primary-600">
              Home
            </a>
          </li>
          <li>
            <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
          </li>
          <li className="text-gray-900 dark:text-white">Manage Products</li>
        </ol>
      </nav>
    </div>
  );
};

export default ManageBreadcrumb;
