import { createContext, useReducer, useContext } from "react";
import { cartReducer } from "../reducers/cartReducer.js";
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer,[]);

  return (
    <CartContext.Provider value={{ cart, cartDispatch: dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart=()=>{
   return useContext(CartContext)
}


export default CartProvider;
