const CartAndSummary = ({ children }) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg p-6 border border-gray-200">{children}</div>
    </div>
  );
};

export default CartAndSummary;
