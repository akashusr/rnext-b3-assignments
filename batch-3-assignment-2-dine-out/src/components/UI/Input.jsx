export default function Input({
  label,
  type,
  placeholder,
  value,
  onChangeValue,
  required = false,
}) {
  return (
    <input
      type={type}
      className="bg-opacity-50 focus:ring-primary w-full rounded-md bg-gray-700 p-2 transition-all duration-300 focus:ring-2 focus:outline-none"
      placeholder={placeholder}
      value={value}
      onInput={onChangeValue}
      required={required}
    />
  );
}
