import React from "react";

const NewsLetter = () => {
  return (
    <section className="py-16 bg-primary-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
        <p className="text-primary-100 mb-8">
          Get notified about new farmers, seasonal produce, and special offers
        </p>

        <div className="flex max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <button className="bg-primary-800 hover:bg-primary-900 text-white px-6 py-3 rounded-r-lg font-medium transition">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
