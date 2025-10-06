export const cartReducer = (state, action) => {
  switch (action.type) {
    case "toggle-to-cart": {
      const index = state.findIndex(
        product => product.id === action.payload.selectedProduct.id
      );
      // this is checking is the product already has ?
      if (index !== -1) {
        const filteredProducts = state.filter(
          product => product.id !== action.payload.selectedProduct.id
        );
        return filteredProducts;
      } else {
        const newProduct = { ...action.payload.selectedProduct, quantity: 1 };

        return [...state, newProduct];
      }
    }
    case "update-quantity": {
      const value = action.payload.value;
      const updatedProduct = state.map(product => {
        if (product.id === action.payload.id) {
          return {
            ...product,
            quantity:
              value === "increment"
                ? product.quantity + 1
                : product.quantity - 1
          };
        } else {
          return product;
        }
      });
      return updatedProduct;
    }

    case "check-out": {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
