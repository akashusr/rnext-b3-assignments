import HomePage from "./components/pages/Homepage";
import ProductsProvider from "./context/ProductContext";
import CartProvider from "./context/CartContext";
// Use Homepage component because in future if we use routing then we add more pages.
const App = () => {
  return (
    <>
      <ProductsProvider>
        <CartProvider>
          <HomePage />
        </CartProvider>
      </ProductsProvider>
    </>
  );
};

export default App;
