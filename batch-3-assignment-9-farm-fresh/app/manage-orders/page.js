import OrderList from "@/components/orders/OrderList";
import OrdersHero from "@/components/orders/OrdersBreadCrumb";
import OrdersPagination from "@/components/orders/OrdersPagination";
import OrderStatusFilter from "@/components/orders/OrderStatusFilter";
import {
  getBookingsForFarmer,
  getBookingsForBuyer,
  getBookingsForFarmerPaginated,
  getBookingsForBuyerPaginated,
} from "@/actions/buyActions";
import { auth } from "@/auth";
import { User } from "@/models/UserModel";
import { dbConnect } from "@/mongo";
import { redirect } from "next/navigation";
import React from "react";

const ManageOrdersPage = async ({ searchParams }) => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Get user details to check role
  await dbConnect();
  const user = await User.findById(userId);
  if (!user) {
    redirect("/login");
  }

  const userRole = user.role;
  let paged = { items: [], total: 0, page: 1, pageSize: 10, totalPages: 1 };
  let pageTitle = "";
  let pageDescription = "";

  const rawStatus = (searchParams?.status || "").toString().toLowerCase();
  const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  const status = allowed.includes(rawStatus) ? rawStatus : undefined;

  const page = Number(searchParams?.page) || 1;
  const pageSize = 10; // adjust as needed

  if (userRole === "farmer") {
    paged = await getBookingsForFarmerPaginated({
      farmerId: userId,
      status,
      page,
      limit: pageSize,
    });
    pageTitle = "Manage Orders";
    pageDescription =
      "Review, accept or cancel incoming orders and manage order status";
  } else {
    // For regular users (customers), show their orders
    paged = await getBookingsForBuyerPaginated({
      buyerId: userId,
      status,
      page,
      limit: pageSize,
    });
    pageTitle = "My Orders";
    pageDescription = "Track and manage your orders";
  }

  return (
    <>
      <OrdersHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {pageTitle}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {pageDescription}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <OrderStatusFilter />
          </div>
        </div>

        <OrderList
          bookings={paged.items}
          role={userRole === "farmer" ? "farmer" : "buyer"}
          currentUserId={userId}
        />
        <OrdersPagination
          currentPage={paged.page}
          totalPages={paged.totalPages}
        />
      </div>
    </>
  );
};

export default ManageOrdersPage;
