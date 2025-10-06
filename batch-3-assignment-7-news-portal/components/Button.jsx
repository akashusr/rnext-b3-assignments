const Button = ({ onSmash, styles = "", children }) => {
  return (
    <button
      onClick={onSmash}
      className={`px-2 py-1 ${
        styles ? "bg-black text-white" : "hover:bg-gray-100"
      } rounded transition-colors`}
    >
      {children}
    </button>
  );
};

export default Button;
