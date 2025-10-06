import { cn } from "../../lib/utils";
import Button from "./Button";

const PasswordInput = ({
  className,
  type = "password",
  error,
  label,
  ...rest
}) => {
  return (
    <>
      {label && <label className="block mb-2 text-sm">{label}</label>}
      <div className="relative">
        <input
          type={type}
          className={cn(
            "form-input dark:placeholder:text-slate-400",
            className
          )}
          {...rest}
        />
        <Button className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-slate-400 text-sm">
          Show
        </Button>
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </>
  );
};

export default PasswordInput;
