import EmailConfirmation from "@/components/success/EmailConfirmation";
import OrderDetails from "@/components/success/OrderDetails";
import SuccessAction from "@/components/success/SuccessAction";
import SuccessMessage from "@/components/success/SuccessMessage";
import { getBookingById, getBookingsByIds } from "@/actions/buyActions";
import MultiOrderDetails from "@/components/success/MultiOrderDetails";
import React from "react";

const SuccessPage = async ({ searchParams }) => {
  const { bookingId = null, bookingIds = null } = searchParams || {};
  let booking = null;
  let multi = [];
  try {
    if (bookingIds) {
      const ids = decodeURIComponent(bookingIds)
        .split(/[,]/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (ids.length) {
        multi = await getBookingsByIds(ids);
      }
    } else if (bookingId) {
      booking = await getBookingById(bookingId);
    }
  } catch (e) {
    console.error("Success page load error", e);
  }
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SuccessMessage />
      <EmailConfirmation />
      {multi.length > 0 ? (
        <MultiOrderDetails bookings={multi} />
      ) : booking ? (
        <OrderDetails booking={booking} />
      ) : (
        <div className="my-8 p-6 rounded-lg bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100">
          No order details found. Please check your orders list.
        </div>
      )}
      <SuccessAction />
    </div>
  );
};

export default SuccessPage;
