import { OrderSummary as Summary } from "../../../models/OrderSummary";
import OrderSummary from "./OrderSummary";

export default function OrderSummaries({ orders }) {
  const summaries = [
    new Summary({
      number: orders.length,
      label: "Total Order",
      color: {
        foreground: { base: "text-yellow-500", shade: "text-yellow-200" },
        background: "bg-yellow-800",
      },
    }),
    new Summary({
      number: orders.filter((order) => order.status === "pending").length,
      label: "Pending",
      color: {
        foreground: { base: "text-red-500", shade: "text-red-200" },
        background: "bg-red-800",
      },
    }),
    new Summary({
      number: orders.filter((order) => order.status === "delivered").length,
      label: "Delivered",
      color: {
        foreground: { base: "text-green-500", shade: "text-green-200" },
        background: "bg-green-800",
      },
    }),
  ];

  return (
    <div className="mb-6 grid grid-cols-3 gap-4">
      {summaries.map((summary) => (
        <OrderSummary key={summary.id} {...summary} />
      ))}
    </div>
  );
}
