export default function OrderReportsTableRow({ children, isHead = false }) {
  return (
    <tr className={isHead ? "text-left text-sm" : "border-t border-gray-700"}>
      {children}
    </tr>
  );
}
