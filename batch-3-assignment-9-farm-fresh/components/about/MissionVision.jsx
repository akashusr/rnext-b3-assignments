import React from "react";
import Image from "next/image";

const MissionVision = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            To revolutionize the way people access fresh, organic produce by
            creating a direct connection between local farmers and consumers. We
            believe in supporting sustainable agriculture while providing
            communities with the freshest, most nutritious food possible.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Through our platform, we empower farmers to reach wider markets,
            earn fair prices for their produce, and build lasting relationships
            with customers who value quality and sustainability.
          </p>
        </div>
        <div className="relative">
          <Image
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop"
            alt="Farm landscape"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default MissionVision;
