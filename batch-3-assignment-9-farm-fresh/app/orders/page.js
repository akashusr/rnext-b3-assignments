import OrderList from "@/components/orders/OrderList";
import OrdersHero from "@/components/orders/OrdersBreadCrumb";
import OrdersPagination from "@/components/orders/OrdersPagination";
import OrderStatusFilter from "@/components/orders/OrderStatusFilter";
import { getBookingsForBuyerPaginated } from "@/actions/buyActions";
import { auth } from "@/auth";
import React from "react";

const OrdersPage = async ({ searchParams }) => {
  const session = await auth();
  const userId = session?.user?.id;
  const page = Number(searchParams?.page) || 1;
  const pageSize = 6; // tweak as needed
  const rawStatus = (searchParams?.status || "").toString().toLowerCase();
  const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"]; // map legacy accepted to confirmed
  const status = allowed.includes(rawStatus) ? rawStatus : undefined;
  const paged = userId
    ? await getBookingsForBuyerPaginated({
        buyerId: userId,
        page,
        limit: pageSize,
        status,
      })
    : { items: [], total: 0, page: 1, pageSize, totalPages: 1 };

  return (
    <>
      <OrdersHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track and manage your orders
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <OrderStatusFilter />
          </div>
        </div>

        {/* Orders List */}
        <OrderList bookings={paged.items} role="buyer" currentUserId={userId} />

        {/* Pagination */}
        <OrdersPagination
          currentPage={paged.page}
          totalPages={paged.totalPages}
        />
      </div>
    </>
  );
};

export default OrdersPage;
