const Button = ({onSmash, children, styles }) => {
  return (
    <button onClick={onSmash} className={`${styles} rounded-md  text-sm`}>
      {children}
    </button>
  );
};

export default Button;
