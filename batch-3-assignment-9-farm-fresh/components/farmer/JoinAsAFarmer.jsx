import React from "react";

const JoinAsAFarmer = () => {
  return (
    <div className="bg-primary-600 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Want to Join Our Farmer Community?
        </h2>
        <p className="text-xl text-primary-100 mb-8">
          Share your fresh produce with thousands of customers and grow your
          business
        </p>
        <a
          href="register.html"
          className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Join as Farmer
        </a>
      </div>
    </div>
  );
};

export default JoinAsAFarmer;
