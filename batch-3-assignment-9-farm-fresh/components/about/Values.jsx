import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faHandshake,
  faAward,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Values = () => {
  return (
    <div className="bg-white dark:bg-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Values
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            These core values guide everything we do and shape our commitment to
            farmers and customers alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon
                icon={faLeaf}
                className="text-2xl text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Sustainability
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We promote eco-friendly farming practices that protect our
              environment for future generations.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon
                icon={faHandshake}
                className="text-2xl text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Community
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Building strong relationships between farmers and consumers to
              create thriving local communities.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon
                icon={faAward}
                className="text-2xl text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Quality
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ensuring the highest standards of freshness, taste, and
              nutritional value in every product.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Values;
