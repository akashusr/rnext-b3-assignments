import { initialProducts } from "../data/initialProducts.js";
export const productsReducer = (state, action) => {
  switch (action.type) {
    case "filtering": {
      const status = action.payload;

      const copyProducts = [...state];
      if (status === "most popular") {
        copyProducts.sort((a, b) => b.rating - a.rating);
      } else if (status === "low to high") {
        copyProducts.sort((a, b) => a.price - b.price);
      } else if (status === "high to low") {
        copyProducts.sort((a, b) => b.price - a.price);
      } else if (status === "newest") {
        copyProducts.sort(
          (a, b) =>
            Number(b.date.replaceAll("-", "")) -
            Number(a.date.replaceAll("-", ""))
        );
      } else {
        return initialProducts;
      }
      return copyProducts;
    }
    case "check-out": {
      const updatedProducts = state.map(product => {
        const cartItem = action.payload.find(item => item.id === product.id);

        if (cartItem) {
          return {
            ...product,
            stock: product.stock - cartItem.quantity
          };
        }

        return product;
      });
      return updatedProducts;
    }
    default: {
      return state;
    }
  }
};
