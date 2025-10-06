import { faCopy, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Image from "next/image";

const currency = (n) => `৳${Number(n || 0).toFixed(0)}`;

const OrderDetails = ({ booking }) => {
  const product = booking?.product;
  const qty = Number(booking?.quantityKg || 0);
  const unit = Number(booking?.unitPrice || product?.product_price_per_kg || 0);
  const subtotal = unit * qty;
  const deliveryFee = booking ? 50 : 0;
  const serviceFee = booking ? 25 : 0;
  const total = subtotal + deliveryFee + serviceFee;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
      {/* <!-- Order Summary --> */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Order Details
        </h2>
        {/* 
                <!-- Product --> */}
        <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Image
            src={product?.product_image || "/user.png"}
            alt={product?.product_name || "Product"}
            className="w-16 h-16 rounded-lg object-cover"
            width={80}
            height={80}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {product?.product_name || "-"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quantity: {qty} kg
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900 dark:text-white">
              {currency(subtotal)}
            </p>
          </div>
        </div>

        {/* <!-- Delivery Information --> */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Delivery Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Delivery Date:
              </span>
              <span className="text-gray-900 dark:text-white">
                {new Date(
                  Date.now() + 2 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Delivery Time:
              </span>
              <span className="text-gray-900 dark:text-white">
                10:00 AM - 12:00 PM
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Address:</span>
              <span className="text-gray-900 dark:text-white text-right">
                {booking?.notes || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Payment Summary --> */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Payment Summary
        </h2>

        {/* <!-- Payment Details --> */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="text-gray-900 dark:text-white">
              {currency(subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Delivery Fee:
            </span>
            <span className="text-gray-900 dark:text-white">
              {currency(deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Service Fee:
            </span>
            <span className="text-gray-900 dark:text-white">
              {currency(serviceFee)}
            </span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
              <span>Total Paid:</span>
              <span>{currency(total)}</span>
            </div>
          </div>
        </div>

        {/* <!-- Payment Method --> */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Payment Method
          </h3>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <FontAwesomeIcon
              icon={faCreditCard}
              className="text-lg text-gray-600 dark:text-gray-400"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Card</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Paid on {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* <!-- Transaction ID --> */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Transaction ID
              </p>
              <p className="font-mono text-sm text-gray-900 dark:text-white">
                {booking?.id || "-"}
              </p>
            </div>
            <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
