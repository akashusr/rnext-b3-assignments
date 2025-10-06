import OrderReportsSection from "./Report/OrderReportsSection";
import OrderSummariesSection from "./Summary/OrderSummariesSection";

export default function OrderInfosSection({
  orders,
  onDeliverOrder,
  onDeleteOrder,
}) {
  return (
    <div className="h-[calc(100vh_-_130px)] md:col-span-2">
      <OrderSummariesSection orders={orders} />
      <OrderReportsSection
        orders={orders}
        onDeliverOrder={onDeliverOrder}
        onDeleteOrder={onDeleteOrder}
      />
    </div>
  );
}
