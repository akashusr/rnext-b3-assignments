import OrderSummaries from "./OrderSummaries";

export default function OrderSummariesSection({ orders }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
      <OrderSummaries orders={orders} />
    </div>
  );
}
