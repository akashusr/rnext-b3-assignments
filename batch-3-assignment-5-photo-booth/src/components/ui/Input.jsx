import { cn } from "../../lib/utils";

const Input = ({ className, type = "text", error, label, ...rest }) => {
  return (
    <>
      {label && <label className="block mb-2 text-sm">{label}</label>}

      <input
        type={type}
        className={cn("form-input dark:placeholder:text-slate-400", className)}
        {...rest}
      />

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </>
  );
};

export default Input;
