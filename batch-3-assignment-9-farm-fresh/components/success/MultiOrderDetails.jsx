"use client";
import React from "react";
import Image from "next/image";

const currency = (n) => `৳${Number(n || 0).toFixed(0)}`;

const MultiOrderDetails = ({ bookings = [] }) => {
  if (!bookings.length) return null;
  const subtotal = bookings.reduce(
    (sum, b) => sum + Number(b.unitPrice || 0) * Number(b.quantityKg || 0),
    0
  );
  const deliveryFee = bookings.length > 0 ? 50 : 0;
  const serviceFee = bookings.length > 0 ? 25 : 0;
  const total = subtotal + deliveryFee + serviceFee;
  return (
    <div className="space-y-8 my-8">
      <h2 className="text-2xl font-bold">Order Details ({bookings.length})</h2>
      <div className="space-y-4">
        {bookings.map((b) => {
          const p = b.product;
          const lineTotal =
            Number(b.unitPrice || 0) * Number(b.quantityKg || 0);
          return (
            <div
              key={b.id}
              className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <Image
                src={p?.product_image || "/user.png"}
                alt={p?.product_name || "Product"}
                width={64}
                height={64}
                className="rounded object-cover w-16 h-16"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{p?.product_name}</div>
                <div className="text-sm text-gray-500">
                  Qty: {b.quantityKg} kg • ৳{b.unitPrice}/kg
                </div>
                <div className="text-sm font-medium">{currency(lineTotal)}</div>
              </div>
              <div className="text-xs text-gray-500 w-24 break-all">
                #{b.id.slice(-6)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 className="font-semibold mb-4">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{currency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>{currency(deliveryFee)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Fee</span>
            <span>{currency(serviceFee)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total Paid</span>
            <span>{currency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiOrderDetails;
