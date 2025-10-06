import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import TagLogo from "./icons/TagLogo";
import Button from "./Button";

const OrderSummary = () => {
  const { cart, cartDispatch } = useCart();
  const { product, productsDispatch } = useProducts();
  let discount = 20;
  let deliveryFee = 15;

  const totalPrice = cart?.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  let discountedPrice = (totalPrice * ( discount / 100)) ;
  let finalPrice = totalPrice - discountedPrice + deliveryFee;

  const handleCheckOut = () => {
    productsDispatch({
      type: "check-out",
      payload: cart
    });
    cartDispatch({
      type: "check-out",
      payload: []
    });
  };

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-4">Order Summary</h3>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${totalPrice}</span>
        </div>
        <div className="flex justify-between text-red-500">
          <span>Discount (-20%)</span>
          <span>-${totalPrice > 0 ? discountedPrice : 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium">${deliveryFee}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>${finalPrice}</span>
        </div>
      </div>

      <div className="flex justify-between items-center space-x-2 mb-6">
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Add promo code"
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
          />
          <span className="absolute right-3 top-2.5">
            <TagLogo />
          </span>
        </div>
        <Button styles="bg-black px-4 py-2 text-white">Apply</Button>
      </div>

      <Button
        onSmash={handleCheckOut}
        styles="bg-black text-white px-4 py-2 w-full"
      >
        Go to Checkout
        <span className="inline-block ml-2">→</span>
      </Button>
    </div>
  );
};

export default OrderSummary;
