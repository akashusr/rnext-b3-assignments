import { createContext, useReducer, useContext } from "react";
import { initialProducts } from "../data/initialProducts.js";
import { productsReducer } from "../reducers/productsReducer.js";
const ProductContext = createContext();

const ProductsProvider = ({ children }) => {
  const [products, dispatch] = useReducer(productsReducer, initialProducts);

  return (
    <ProductContext.Provider value={{ products, productsDispatch: dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductContext);
};

export default ProductsProvider;
