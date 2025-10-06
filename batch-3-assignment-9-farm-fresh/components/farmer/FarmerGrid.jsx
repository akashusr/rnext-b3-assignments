import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCertificate,
  faStar,
  faMapMarkerAlt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const FarmerGrid = ({ farmers = [], stats, showLoadMore, onLoadMore }) => {
  const {
    total = 0,
    products = 0,
    organicPercent = 0,
    districts = 0,
  } = stats || {};
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <StatBox label="Active Farmers" value={total} />
        <StatBox label="Districts Covered" value={districts} />
        <StatBox label="Products Available" value={products} />
        <StatBox label="Organic Certified" value={`${organicPercent}%`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {farmers.map((f) => (
          <FarmerCard key={f.id} farmer={f} />
        ))}
        {farmers.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No farmers found.
          </div>
        )}
      </div>
      {showLoadMore && (
        <div className="text-center mt-12">
          <button
            onClick={onLoadMore}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition"
          >
            Load More Farmers
          </button>
        </div>
      )}
    </div>
  );
};

const StatBox = ({ label, value }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
      {value}
    </div>
    <div className="text-gray-600 dark:text-gray-400">{label}</div>
  </div>
);

const FarmerCard = ({ farmer }) => {
  const { name, address, image, farmDetails, productCount } = farmer;
  const specialization = farmDetails?.specialization;
  const size = farmDetails?.farmSize;
  const sizeUnit = farmDetails?.farmSizeUnit;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <Image
          src={
            image ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face"
          }
          alt={name}
          className="w-full h-64 object-cover"
          width={400}
          height={600}
        />
        <div className="absolute top-4 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            <FontAwesomeIcon icon={faCertificate} className="mr-1" />
            Farmer
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {name}
          </h3>
          <div className="flex items-center text-yellow-400">
            <FontAwesomeIcon icon={faStar} className="mr-1" />
            <span className="text-gray-600 dark:text-gray-400 ml-1">--</span>
          </div>
        </div>
        {address && (
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            {address}
          </p>
        )}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-medium">Farm Size:</span>{" "}
            {size ? `${size} ${sizeUnit || "acres"}` : "n/a"}
          </div>
          <div>
            <span className="font-medium">Products:</span> {productCount}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {specialization && (
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs capitalize">
              {specialization}
            </span>
          )}
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/farmers/${farmer.id}`}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition text-center"
          >
            View Products
          </Link>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <FontAwesomeIcon icon={faPhone} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerGrid;
