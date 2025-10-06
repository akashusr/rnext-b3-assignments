import Product from "./Product";

export default function Products({
  products,
  currentOrder,
  onAddProduct,
  onRemoveProduct,
}) {
  return (
    <div className="items-container">
      {products.map((product) => (
        <Product
          {...product}
          key={product.id}
          isProductExist={
            currentOrder.products.findIndex(
              (currentOrderProduct) => currentOrderProduct.id === product.id,
            ) > -1
          }
          onAdd={() => onAddProduct(product)}
          onRemove={() => onRemoveProduct(product.id)}
        />
      ))}
    </div>
  );
}
