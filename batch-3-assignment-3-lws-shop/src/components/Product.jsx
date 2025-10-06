import CartButton from "./CartButton";
import { getImageLink } from "../utils/getImageLink.js";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
const Product = ({ product }) => {
  const { title, price, rating, stock, image } = product;

  const { cart, cartDispatch } = useCart();
  const { products, productsDispatch } = useProducts();
  // this function generate rating supposed if rating is 3 then add 2 blank rating because total rating is 5.

  const ratingGenerator = () => {
    const MAX_STARS = 5;

    const stars = Array.from({ length: MAX_STARS }, (_, i) => {
      const isFilled = i < rating;
      return (
        <span key={i}>
          {isFilled ? <span>★</span> : <span className="text-gray-300">★</span>}
        </span>
      );
    });
    return stars;
  };
  
  // this is check for button
  const alreadyExist = cart?.findIndex(
    oldProduct => oldProduct.id === product.id
  );

  const handleToggleToCart = selectedProduct => {
    cartDispatch({
      type: "toggle-to-cart",
      payload: {
        selectedProduct
      }
    });
  };
  // check product quantity for updating ui after carting how many stock left
  const productQuantity = cart.find(cartProduct => {
    return cartProduct.id === product.id;
  });

  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden transition-transform hover:scale-[1.02] duration-300">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <img
          src={getImageLink(image)}
          alt="Gradient Graphic T-shirt"
          className="h-full w-auto object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center my-1">
            <div className="flex text-yellow-400">{ratingGenerator()}</div>
            <span className="text-xs text-gray-500 ml-1">{rating}/5</span>
          </div>
          <span className="text-xs text-gray-700">
            (
            {stock === 0
              ? "Out of stock"
              : productQuantity?.quantity
              ? stock - productQuantity?.quantity
              : stock}
            {stock !== 0 ? "pcs left": null})
          </span>
        </div>
        <p className="font-bold">{price}$</p>
        <CartButton
          disabled={stock === 0}
          onSmash={() => handleToggleToCart(product)}
          type={alreadyExist === -1 ? "add" : "remove"}
        />
      </div>
    </div>
  );
};

export default Product;
