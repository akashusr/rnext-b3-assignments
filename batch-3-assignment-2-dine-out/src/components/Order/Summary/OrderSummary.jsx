export default function OrderSummary({ number, color, label }) {
  return (
    <div className="bg-cardbg relative overflow-hidden rounded-lg p-4">
      <div className={`mb-2 text-5xl font-bold ${color.foreground.base}`}>
        {number}
      </div>
      <div
        className={`bg-opacity-50 inline-block rounded-full px-3 py-1 text-xs font-medium ${color.foreground.shade} ${color.background}`}
      >
        {label}
      </div>
    </div>
  );
}
