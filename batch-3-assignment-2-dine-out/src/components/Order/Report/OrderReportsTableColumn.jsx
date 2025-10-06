export default function OrderReportsTableColumn({
  children,
  colSpan = 1,
  className,
  isHead = false,
}) {
  return isHead ? (
    <th className="pb-3 font-medium">{children}</th>
  ) : (
    <td className={`py-3 ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
}
