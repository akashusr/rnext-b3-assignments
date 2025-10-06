import React, { useState, useEffect, useRef } from "react";

const ChevronDown = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {" "}
    <path d="m6 9 6 6 6-6" />{" "}
  </svg>
);

const CustomSelect = ({
  label,
  options,
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={selectRef}>
      <label className="block text-sm font-medium text-zinc-400 mb-1">
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-lg bg-zinc-900/10 px-4 py-2 text-white border border-zinc-700/70 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${isOpen ? "ring-2 ring-blue-500" : ""} ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-zinc-700/20"}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span>
          {disabled
            ? "Loading models..."
            : selectedOption
              ? selectedOption.label
              : "Select a model..."}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg animate-fade-in-down">
          <ul className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            {options.map((option) => (
              <li
                key={option.value}
                className={`flex items-center justify-between p-3 text-sm rounded-md cursor-pointer transition-colors ${value === option.value ? "bg-blue-600 text-white" : "text-zinc-200 hover:bg-zinc-700"}`}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
                {value === option.value && (
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
