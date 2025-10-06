import { cn } from "../../lib/utils";

const strengthMap = {
  1: { color: "bg-red-500", label: "Weak" },
  2: { color: "bg-orange-500", label: "Fair" },
  3: { color: "bg-yellow-500", label: "Good" },
  4: { color: "bg-green-500", label: "Strong" },
};

export const PasswordStrengthIndicator = ({ activeBars }) => {
  const strength = strengthMap[activeBars];

  return (
    <div className="w-full mt-3 mb-2">
      <div className="flex h-1 w-full rounded overflow-hidden bg-gray-200">
        <div
          className={cn("w-full h-full transition-all", strength?.color)}
          style={{ width: `${(activeBars / 4) * 100}%` }}
        />
      </div>
      <div className="mt-1 text-sm font-medium text-gray-600">
        Strength:{" "}
        <span className={cn(strength?.color, "text-white px-2 py-0.5 rounded")}>
          {strength?.label}
        </span>
      </div>
    </div>
  );
};
