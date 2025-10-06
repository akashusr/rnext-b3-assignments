import { useState } from "react";
import Navbar from "./components/Navbar";
import CreateOrderSection from "./components/Order/CreateOrderSection";
import OrderInfosSection from "./components/Order/OrderInfosSection";
import Products from "./data/products.json";

export default function App() {
  const [orders, setOrders] = useState([]);

  const handleAddOrder = (order) => {
    setOrders((prevOrderList) => [order, ...prevOrderList]);
  };

  const handleDeliverOrder = (id) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: "delivered" } : { ...order },
      ),
    );
  };

  const handleDeleteOrder = (id) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  };

  return (
    <div className="container mx-auto flex h-screen flex-col px-4">
      <Navbar />
      <div className="mt-6 grid flex-grow grid-cols-1 gap-6 md:grid-cols-3">
        <CreateOrderSection products={Products} onAddOrder={handleAddOrder} />
        <OrderInfosSection
          orders={orders}
          onDeliverOrder={handleDeliverOrder}
          onDeleteOrder={handleDeleteOrder}
        />
      </div>
    </div>
  );
}
