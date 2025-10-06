"use client";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Image from "next/image";

const currency = (n) => `৳${Number(n || 0).toFixed(0)}`;

const OrderSummary = ({
  items = [],
  pricing,
  address,
  onEditAddress,
  onEditItem,
  onRemoveItem,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftAddress, setDraftAddress] = useState(address || "");
  const [draftItems, setDraftItems] = useState(items);

  const openModal = () => {
    setDraftAddress(address || "");
    setDraftItems(items.map((i) => ({ ...i })));
    setIsModalOpen(true);
  };
  const applyChanges = () => {
    onEditAddress?.(draftAddress);
    draftItems.forEach((it) =>
      onEditItem?.(it.id, { quantityKg: Number(it.quantityKg) })
    );
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Order Summary
      </h2>

      {/* Reorder notification */}
      {items.some((item) => item.source === "reorder") && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <i className="fas fa-redo text-blue-600 dark:text-blue-400 mr-2"></i>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              You&apos;re reordering from a previous purchase. Review and adjust
              quantities as needed.
            </p>
          </div>
        </div>
      )}

      {/* Items */}
      {items.length === 0 ? (
        <div className="text-gray-500">No items to checkout.</div>
      ) : (
        items.map((it) => (
          <div
            key={it.id}
            className="flex items-center space-x-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <Image
              src={it.image || "/user.png"}
              alt={it.name}
              className="w-16 h-16 rounded-lg object-cover"
              width={80}
              height={80}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {it.name}
                </h3>
                {it.source === "reorder" && (
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium">
                    Reorder
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Qty:</span>
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={it.quantityKg}
                  onChange={(e) =>
                    onEditItem?.(it.id, { quantityKg: Number(e.target.value) })
                  }
                  className="w-20 border rounded px-2 py-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
                <button
                  onClick={() => onRemoveItem?.(it.id)}
                  className="ml-2 text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                {currency(it.pricePerKg * it.quantityKg)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currency(it.pricePerKg)}/kg
              </p>
            </div>
          </div>
        ))
      )}

      {/* <!-- Booking Details --> */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Booking Date:
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {new Date().toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Delivery Date:
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {new Date(
              Date.now() + 2 * 24 * 60 * 60 * 1000
            ).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Delivery Address:
          </span>
          <span className="font-medium text-gray-900 dark:text-white text-right max-w-[60%] truncate">
            {address || "Add delivery address"}
          </span>
        </div>
      </div>

      {/* <!-- Price Breakdown --> */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
          <span className="text-gray-900 dark:text-white">
            {currency(pricing?.subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Delivery Fee:
          </span>
          <span className="text-gray-900 dark:text-white">
            {currency(pricing?.deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Service Fee:</span>
          <span className="text-gray-900 dark:text-white">
            {currency(pricing?.serviceFee)}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-600 pt-2">
          <span>Total:</span>
          <span>{currency(pricing?.total)}</span>
        </div>
      </div>

      {/* <!-- Edit Button --> */}
      <button
        onClick={openModal}
        className="w-full mt-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 rounded-lg font-medium transition"
      >
        <FontAwesomeIcon icon={faEdit} className="mr-2" /> Edit Order Details
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-xl shadow-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Edit Order Details</h3>
            <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
              <div>
                <label className="block text-sm mb-1">Delivery Address</label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent p-2"
                  rows={3}
                  value={draftAddress}
                  onChange={(e) => setDraftAddress(e.target.value)}
                />
              </div>
              {draftItems.map((it, idx) => (
                <div key={it.id} className="flex items-center gap-3">
                  <Image
                    src={it.image || "/user.png"}
                    alt={it.name}
                    width={48}
                    height={48}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-gray-500">
                      {currency(it.pricePerKg)}/kg
                    </div>
                  </div>
                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={it.quantityKg}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setDraftItems((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, quantityKg: v } : p
                        )
                      );
                    }}
                    className="w-24 border rounded px-2 py-1 bg-transparent"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={applyChanges}
                className="px-4 py-2 rounded bg-primary-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
