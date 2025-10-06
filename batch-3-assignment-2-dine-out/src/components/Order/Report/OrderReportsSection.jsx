import { useState } from "react";
import Icon from "../../UI/Icon";
import OrderReportsTable from "./OrderReportsTable";

export default function OrderReportsSection({
  orders,
  onDeliverOrder,
  onDeleteOrder,
}) {
  const [filter, setFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return order;
    if (filter === "pending") return order.status === "pending";
    if (filter === "delivered") return order.status === "delivered";
  });

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="mb-4 text-xl font-bold">Order Reports</h2>
        <div className="flex items-center gap-4">
          <Icon name="filter" />
          <select
            className="appearance-none rounded-sm border-none bg-zinc-900 accent-orange-600 outline-none"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>
      <OrderReportsTable
        filteredOrders={filteredOrders}
        onDeliverOrder={onDeliverOrder}
        onDeleteOrder={onDeleteOrder}
      />
    </div>
  );
}
