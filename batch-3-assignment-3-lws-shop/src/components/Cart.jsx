import CartItem from "./CartItem";
import { useCart } from "../context/CartContext";
const Cart = () => {
  const { cart } = useCart();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">YOUR CART</h2>
      {cart.length > 0
        ? cart.map(product => (
            <CartItem key={product.id} product={product} />
          ))
        : "No item selected"}
    </div>
  );
};

export default Cart;
