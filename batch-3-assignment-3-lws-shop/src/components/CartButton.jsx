const CartButton = ({ type = "add", disabled = false, onSmash }) => {
  const baseClasses =
    "w-full mt-2 py-1 text-gray-100 rounded flex items-center justify-center transition-all";

  const typeStyles = {
    add: "bg-gray-800 active:bg-gray-900 active:translate-y-1",
    remove: "bg-red-800"
  };

  const disabledStyles =
    "disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed";

  const label = type === "add" ? "Add to Cart" : "Remove from Cart";

  return (
    <button
      className={`${baseClasses} ${typeStyles[type]} ${
        disabled ? disabledStyles : ""
      }`}
      disabled={disabled}
      onClick={onSmash}
    >
      {label}
    </button>
  );
};

export default CartButton;
