import React from "react";
import Image from "next/image";
import {
  acceptBooking,
  cancelBookingByBuyer,
  cancelBookingByFarmer,
  updateOrderStatus,
} from "@/actions/buyActions";
import {
  upsertReview,
  deleteReview,
  getUserReviewForProduct,
} from "@/actions/reviewActions";
import { revalidatePath } from "next/cache";
import ReviewFormDetails from "@/components/products/details/ReviewFormDetails.client.jsx";
import Link from "next/link";
import DownloadInvoiceButton from "./DownloadInvoiceButton";

// Accept a list of bookings to keep this a pure server component.
// booking: { id, status, totalPrice, quantityKg, unitPrice, createdAt, product: { product_image, product_name } }
const OrderList = async ({ bookings = [], role = "buyer", currentUserId }) => {
  // Server actions invoked by forms
  async function buyerCancelAction(formData) {
    "use server";
    const bookingId = formData.get("bookingId");
    if (!bookingId || !currentUserId) return;
    await cancelBookingByBuyer({
      bookingId: String(bookingId),
      buyerId: String(currentUserId),
    });
    revalidatePath("/orders");
    revalidatePath("/manage-orders");
  }

  async function farmerAcceptAction(formData) {
    "use server";
    const bookingId = formData.get("bookingId");
    if (!bookingId || !currentUserId) return;
    await acceptBooking({
      bookingId: String(bookingId),
      farmerId: String(currentUserId),
    });
    revalidatePath("/manage-orders");
  }

  async function farmerCancelAction(formData) {
    "use server";
    const bookingId = formData.get("bookingId");
    if (!bookingId || !currentUserId) return;
    await cancelBookingByFarmer({
      bookingId: String(bookingId),
      farmerId: String(currentUserId),
    });
    revalidatePath("/manage-orders");
  }

  async function updateStatusAction(formData) {
    "use server";
    const bookingId = formData.get("bookingId");
    const status = formData.get("status");
    if (!bookingId || !status || !currentUserId) return;

    await updateOrderStatus({
      bookingId: String(bookingId),
      farmerId: String(currentUserId),
      status: String(status),
    });
    revalidatePath("/manage-orders");
  }

  // Buyer: reorder a previously accepted or cancelled booking
  async function buyerReorderAction(formData) {
    "use server";
    const productId = formData.get("productId");
    const quantity = formData.get("quantityKg");
    if (!productId || !quantity || !currentUserId) return;

    // Redirect to payment page for reorder confirmation
    const { redirect } = await import("next/navigation");
    const params = new URLSearchParams({
      productId: String(productId),
      qty: String(quantity),
      from: "reorder",
    });
    redirect(`/payment?${params.toString()}`);
  }

  // Removed server download placeholder; using client fetch below.

  // Buyer: leave or update a review for delivered order
  async function buyerReviewAction(formData) {
    "use server";
    const productId = formData.get("productId");
    const rating = formData.get("rating");
    const comment = formData.get("comment");
    if (!productId || !rating || !currentUserId) return;
    // Server will validate delivered status
    const pid = String(productId);
    await upsertReview({
      userId: String(currentUserId),
      productId: pid,
      rating: Number(rating),
      comment: String(comment || ""),
    });
    revalidatePath("/orders");
    revalidatePath(`/products/${pid}`);
  }

  // Buyer: delete an existing review
  async function buyerDeleteReviewAction(formData) {
    "use server";
    const productId = formData.get("productId");
    if (!productId || !currentUserId) return;
    const pid = String(productId);
    await deleteReview({ userId: String(currentUserId), productId: pid });
    revalidatePath("/orders");
    revalidatePath(`/products/${pid}`);
  }
  const statusBadge = (status) => {
    const map = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      accepted:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      confirmed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      delivered:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      cancelled_by_buyer:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      cancelled_by_farmer:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    const labelMap = {
      pending: "Pending",
      accepted: "Confirmed",
      confirmed: "Confirmed",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled_by_buyer: "Cancelled",
      cancelled_by_farmer: "Cancelled",
      cancelled: "Cancelled",
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          map[status] || map.pending
        }`}
      >
        <i className="fas fa-circle mr-1"></i>
        {labelMap[status] || "Pending"}
      </span>
    );
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return "";
    }
  };

  // Prefetch current user's review per delivered product to support edit state
  let myReviewsByProduct = new Map();
  if (role === "buyer" && currentUserId && bookings?.length) {
    const deliveredProductIds = Array.from(
      new Set(
        bookings
          .filter((b) => b.status === "delivered")
          .map((b) => b.product?.id)
          .filter(Boolean)
      )
    );
    if (deliveredProductIds.length) {
      const results = await Promise.all(
        deliveredProductIds.map(async (pid) => {
          try {
            const r = await getUserReviewForProduct({
              userId: String(currentUserId),
              productId: String(pid),
            });
            return [pid, r];
          } catch (e) {
            return [pid, null];
          }
        })
      );
      myReviewsByProduct = new Map(results);
    }
  }

  return (
    <div className="space-y-6">
      {bookings.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-300">
          No orders found.
        </div>
      )}
      {bookings.map((b) => (
        <div
          key={b.id}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order #{b.id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Placed on {formatDate(b.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {statusBadge(b.status)}
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ৳{b.totalPrice}
                </span>
              </div>
            </div>

            {/* Order Item */}
            <Link
              href={`/products/${b.product?.id}`}
              className="border-t border-gray-200 dark:border-gray-600 pt-4"
            >
              <div className="flex items-center space-x-4 mb-4">
                <Image
                  src={
                    b.product?.product_image || "https://placehold.co/80x80/png"
                  }
                  alt={b.product?.product_name || "Product"}
                  className="w-16 h-16 rounded-lg object-cover"
                  width={80}
                  height={80}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {b.product?.product_name || "Product"}
                    {typeof b.product?.product_stock === "number" &&
                      b.product.product_stock <= 0 && (
                        <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                          Out of Stock
                        </span>
                      )}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Quantity: {b.quantityKg} kg • ৳{b.unitPrice}/kg
                  </p>
                  {typeof b.product?.product_stock === "number" && (
                    <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                      Current Stock: {b.product.product_stock} kg
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    ৳{b.totalPrice}
                  </p>
                </div>
              </div>
            </Link>

            {/* Actions */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 flex flex-wrap gap-3">
              {/* Buyer Actions */}
              {role === "buyer" && (
                <>
                  {b.status === "pending" && (
                    <form action={buyerCancelAction}>
                      <input type="hidden" name="bookingId" value={b.id} />
                      <button className="flex items-center px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg font-medium transition">
                        <i className="fas fa-times mr-2"></i>
                        Cancel Order
                      </button>
                    </form>
                  )}
                  {(b.status === "accepted" ||
                    b.status === "confirmed" ||
                    b.status === "shipped" ||
                    b.status === "delivered") && (
                    <>
                      <DownloadInvoiceButton bookingId={b.id} />
                      <form action={buyerReorderAction}>
                        <input
                          type="hidden"
                          name="productId"
                          value={b.product?.id || ""}
                        />
                        <input
                          type="hidden"
                          name="quantityKg"
                          value={b.quantityKg}
                        />
                        <button className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition">
                          <i className="fas fa-redo mr-2"></i>
                          Reorder
                        </button>
                      </form>
                      {b.status === "delivered" && (
                        <ReviewFormDetails
                          show={true}
                          productId={b.product?.id || ""}
                          myReview={
                            (b.product?.id &&
                              myReviewsByProduct.get(b.product.id)) ||
                            null
                          }
                          submitReview={buyerReviewAction}
                          removeReview={buyerDeleteReviewAction}
                        />
                      )}
                    </>
                  )}
                </>
              )}

              {/* Farmer Actions */}
              {role === "farmer" && (
                <>
                  {b.status === "pending" && (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-3">
                        <form action={farmerAcceptAction}>
                          <input type="hidden" name="bookingId" value={b.id} />
                          <button
                            className="flex items-center px-4 py-2 rounded-lg font-medium transition text-white disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-primary-600 bg-primary-600 hover:bg-primary-700"
                            disabled={
                              typeof b.product?.product_stock === "number" &&
                              b.product.product_stock < b.quantityKg
                            }
                            title={
                              typeof b.product?.product_stock === "number" &&
                              b.product.product_stock < b.quantityKg
                                ? "Not enough stock to accept"
                                : "Accept order"
                            }
                          >
                            <i className="fas fa-check mr-2"></i>
                            Accept
                          </button>
                        </form>
                        <form action={farmerCancelAction}>
                          <input type="hidden" name="bookingId" value={b.id} />
                          <button className="flex items-center px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg font-medium transition">
                            <i className="fas fa-times mr-2"></i>
                            Cancel
                          </button>
                        </form>
                      </div>
                      {typeof b.product?.product_stock === "number" &&
                        b.product.product_stock < b.quantityKg && (
                          <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                            <i className="fas fa-exclamation-triangle"></i>
                            Not enough stock (need {b.quantityKg} kg, have{" "}
                            {b.product.product_stock} kg)
                          </div>
                        )}
                    </div>
                  )}
                  {(b.status === "accepted" || b.status === "confirmed") && (
                    <div className="flex gap-2">
                      <form action={updateStatusAction}>
                        <input type="hidden" name="bookingId" value={b.id} />
                        <input type="hidden" name="status" value="shipped" />
                        <button className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition">
                          <i className="fas fa-truck mr-1"></i>
                          Ship
                        </button>
                      </form>
                      <form action={updateStatusAction}>
                        <input type="hidden" name="bookingId" value={b.id} />
                        <input type="hidden" name="status" value="cancelled" />
                        <button className="flex items-center px-3 py-1 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-md text-sm font-medium transition">
                          <i className="fas fa-times mr-1"></i>
                          Cancel
                        </button>
                      </form>
                    </div>
                  )}
                  {b.status === "shipped" && (
                    <form action={updateStatusAction}>
                      <input type="hidden" name="bookingId" value={b.id} />
                      <input type="hidden" name="status" value="delivered" />
                      <button className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
                        <i className="fas fa-check-circle mr-2"></i>
                        Mark as Delivered
                      </button>
                    </form>
                  )}
                  {(b.status === "cancelled" ||
                    b.status === "cancelled_by_buyer" ||
                    b.status === "cancelled_by_farmer" ||
                    b.status === "delivered") && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2">
                      No actions available
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
