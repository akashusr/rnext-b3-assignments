"use client";
import {
  faCreditCard,
  faLock,
  faMobileAlt,
  faShieldAlt,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const PaymentForm = ({ total = 0, onSubmit }) => {
  const [method, setMethod] = useState("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSubmit?.(method, {
        cardName,
        cardNumber,
        expiry,
        cvv,
        mobileNumber,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Payment Information
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* <!-- Payment Method --> */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Payment Method
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                className="text-primary-600 focus:ring-primary-500"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
              <div className="ml-3 flex items-center">
                <FontAwesomeIcon icon={faCreditCard} className="text-lg mr-2" />
                <span className="font-medium">Credit/Debit Card</span>
              </div>
            </label>
            <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="radio"
                name="paymentMethod"
                value="bkash"
                className="text-primary-600 focus:ring-primary-500"
                checked={method === "bkash"}
                onChange={() => setMethod("bkash")}
              />
              <div className="ml-3 flex items-center">
                <FontAwesomeIcon icon={faMobileAlt} className="text-lg mr-2" />
                <span className="font-medium">bKash</span>
              </div>
            </label>
            <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="radio"
                name="paymentMethod"
                value="nagad"
                className="text-primary-600 focus:ring-primary-500"
                checked={method === "nagad"}
                onChange={() => setMethod("nagad")}
              />
              <div className="ml-3 flex items-center">
                <FontAwesomeIcon icon={faWallet} className="text-lg mr-2" />
                <span className="font-medium">Nagad</span>
              </div>
            </label>
          </div>
        </div>

        {/* <!-- Card Details --> */}
        <div
          id="cardDetails"
          className={`space-y-4 ${method === "card" ? "" : "hidden"}`}
        >
          <div>
            <label
              htmlFor="cardName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Name on Card
            </label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              required={method === "card"}
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              required={method === "card"}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expiry"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Expiry Date
              </label>
              <input
                type="text"
                id="expiry"
                name="expiry"
                required={method === "card"}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label
                htmlFor="cvv"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                CVV
              </label>
              <input
                type="password"
                id="cvv"
                name="cvv"
                maxLength={4}
                required={method === "card"}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="123"
              />
            </div>
          </div>
        </div>

        {/* <!-- Mobile Payment Details --> */}
        <div
          id="mobileDetails"
          className={`${method !== "card" ? "" : "hidden"} space-y-4`}
        >
          <div>
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="+880 1234 567890"
            />
          </div>
        </div>

        {/* <!-- Billing Address --> */}
        <div>
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              defaultChecked
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Same as delivery address
            </span>
          </label>
        </div>

        {/* <!-- Submit Button --> */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white py-3 px-4 rounded-lg font-medium text-lg transition duration-200 transform hover:scale-105"
        >
          <FontAwesomeIcon icon={faLock} className="mr-2" />
          {loading
            ? "Processing..."
            : `Complete Payment - ৳${Number(total || 0).toFixed(0)}`}
        </button>

        {/* <!-- Security Notice --> */}
        <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
          Your payment information is secure and encrypted
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
