export default function FinanceCard({
  title,
  amount,
  icon,
  bgColor,
  iconColor,
}) {
  const num = Number(amount) || 0;

  const formattedAmount =
    num < 0
      ? `-₹${Math.abs(num).toLocaleString("en-IN")}`
      : `₹${num.toLocaleString("en-IN")}`;

  const amountColor =
    title === "Net Profit"
      ? num < 0
        ? "text-red-600"
        : "text-green-600"
      : "text-slate-800";

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-5 flex items-center justify-between hover:shadow-lg transition-all">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>

        <h2 className={`text-2xl font-bold mt-2 ${amountColor}`}>
          {formattedAmount}
        </h2>
      </div>

      <div className={`p-3 rounded-full ${bgColor}`}>
        <span className={`text-xl ${iconColor}`}>{icon}</span>
      </div>
    </div>
  );
}