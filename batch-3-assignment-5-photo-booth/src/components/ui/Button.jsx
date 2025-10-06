import { cn } from "../../lib/utils";

const Button = ({
  children,
  className,
  type = "button",
  disabled,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={cn("cursor-pointer", className)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
