import { useState } from "react";
import { useCart } from "../context/CartContext";
import { getImageLink } from "../utils/getImageLink.js";

const CartItem = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { cartDispatch } = useCart();
  const { title, price, color, size, image } = product;

  const handlAddQuantity = () => {
    if (quantity < product.stock) {
      const nextQuantity = quantity + 1;
      setQuantity(prev => prev + 1);
      cartDispatch({
        type: "update-quantity",
        payload: {
          id: product.id,
          quantity: nextQuantity,
          value: "increment"
        }
      });
    }
  };

  const handlRemoveQuantity = () => {
    if (quantity > 1) {
      const nextQuantity = quantity - 1;
      setQuantity(prev => prev - 1);
      cartDispatch({
        type: "update-quantity",
        payload: {
          id: product.id,
          quantity: nextQuantity,
          value: "decrement"
        }
      });
    }
  };
  return (
    <div className="flex items-start space-x-4 pb-4 border-b border-gray-200 mb-4">
      <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
        <img
          src={getImageLink(image)}
          alt="Gradient Graphic T-shirt"
          className="h-full w-auto object-cover"
        />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between">
          <h3 className="font-medium">{title}</h3>
          <span
            onClick={() =>
              cartDispatch({
                type: "toggle-to-cart",
                payload: {
                  selectedProduct: product
                }
              })
            }
            className="text-red-500 text-sm"
          >
            ×
          </span>
        </div>
        <p className="text-sm text-gray-500">Size: {size}</p>
        <p className="text-sm text-gray-500">Color: {color}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="font-bold">${price}</p>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlRemoveQuantity}
              className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"
            >
              −
            </button>
            <span className="text-sm">{quantity}</span>
            <button
              onClick={handlAddQuantity}
              className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
