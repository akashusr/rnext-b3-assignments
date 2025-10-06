import Image from "next/image";
import React from "react";

const Team = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Meet Our Team
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Passionate individuals working together to transform agriculture and
          food distribution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <Image
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
            alt="CEO"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Ahmed Rahman
          </h3>
          <p className="text-primary-600 dark:text-primary-400 mb-2">
            CEO & Founder
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Former agricultural engineer with 15+ years of experience in
            sustainable farming.
          </p>
        </div>

        <div className="text-center">
          <Image
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
            alt="CTO"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Fatima Khan
          </h3>
          <p className="text-primary-600 dark:text-primary-400 mb-2">CTO</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Technology leader passionate about using innovation to solve
            agricultural challenges.
          </p>
        </div>

        <div className="text-center">
          <Image
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
            alt="Head of Operations"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Karim Hassan
          </h3>
          <p className="text-primary-600 dark:text-primary-400 mb-2">
            Head of Operations
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Supply chain expert ensuring efficient delivery from farm to table.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Team;
