"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Status filter select that syncs with URL search params.
// When 'all' selected, removes status param; always removes page param to reset pagination.
const DEFAULT_OPTIONS = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function OrderStatusFilter({
  options = DEFAULT_OPTIONS,
  paramName = "status",
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const current = (searchParams.get(paramName) || "all").toLowerCase();

  function onChange(e) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (value === "all") params.delete(paramName);
    else params.set(paramName, value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <select
      onChange={onChange}
      value={current}
      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
