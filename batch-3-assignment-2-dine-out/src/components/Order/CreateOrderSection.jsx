import { useState } from "react";
import Products from "../Product/Products";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Label from "../UI/Label";

const initialOrder = {
  name: "",
  products: [],
};

export default function CreateOrderSection({ products, onAddOrder }) {
  const [currentOrderId, setCurrentOrderId] = useState(1);
  const [currentOrder, setCurrentOrder] = useState({ ...initialOrder });

  const handleChangeName = (e) => {
    setCurrentOrder((prevCurrentOrder) => ({
      ...prevCurrentOrder,
      name: e.target.value,
    }));
  };

  const handleAddProduct = (product) => {
    setCurrentOrder((prevCurrentOrder) => ({
      ...prevCurrentOrder,
      products: [...prevCurrentOrder.products, product],
    }));
  };

  const handleRemoveProduct = (id) => {
    setCurrentOrder((prevCurrentOrder) => ({
      ...prevCurrentOrder,
      products: prevCurrentOrder.products.filter(
        (product) => product.id !== id,
      ),
    }));
  };

  const handlePlaceOrder = () => {
    if (!currentOrder.name) return alert("Customer Name must not be empty!");
    if (currentOrder.products.length === 0)
      return alert("You must choose at least one food!");

    onAddOrder({
      ...currentOrder,
      name: currentOrder.name.trim(),
      id: currentOrderId,
      orderedAt: Date.now(),
      status: "pending",
    });
    setCurrentOrderId((prevCurrenOrderId) => prevCurrenOrderId + 1);
    setCurrentOrder({ ...initialOrder });
  };

  return (
    <div className="bg-cardbg h-[calc(100vh_-_130px)] rounded-lg p-6">
      <h2 className="mb-1 text-xl font-bold">CREATE ORDER</h2>
      <p className="mb-4 text-sm text-gray-400">
        Accurately fulfill customer orders based on a precise understanding of
        their requirements.
      </p>

      <div className="mb-4">
        <Label>Customer Name</Label>
        <Input
          type="text"
          placeholder="eg. John Doe"
          value={currentOrder.name}
          onChangeValue={handleChangeName}
          required={true}
        />
      </div>

      <div className="mb-4">
        <Label>Choose items</Label>
        <Products
          products={products}
          currentOrder={currentOrder}
          onAddProduct={handleAddProduct}
          onRemoveProduct={handleRemoveProduct}
        />
      </div>

      <Button variant="primary" onClick={handlePlaceOrder}>
        Place Order (BDT{" "}
        {currentOrder.products.reduce((acc, curr) => acc + curr.price, 0)})
      </Button>
    </div>
  );
}
