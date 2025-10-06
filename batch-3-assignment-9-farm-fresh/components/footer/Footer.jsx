import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary-500 p-2 rounded-lg">
                <FontAwesomeIcon
                  icon={faSeedling}
                  className="text-white text-xl"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">FarmFresh</h3>
                <p className="text-sm text-gray-400">Local Farmer Booking</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting communities with fresh, local produce directly from
              farmers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="products.html" className="hover:text-white">
                  Products
                </a>
              </li>
              <li>
                <a href="farmers.html" className="hover:text-white">
                  Farmers
                </a>
              </li>
              <li>
                <a href="about.html" className="hover:text-white">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Farmers</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="register.html" className="hover:text-white">
                  Join as Farmer
                </a>
              </li>
              <li>
                <a href="create.html" className="hover:text-white">
                  Add Products
                </a>
              </li>
              <li>
                <a href="manageList.html" className="hover:text-white">
                  Manage Listings
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Farmer Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 FarmFresh - Local Farmer Booking. All rights reserved by
            LWS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
