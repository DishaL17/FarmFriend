export default function FinanceCard({
  title,
  amount,
  icon,
  bgColor,
  iconColor,
}) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-5 flex items-center justify-between hover:shadow-lg transition">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-3xl font-bold mt-2">₹{amount}</h2>
      </div>

      <div className={`p-4 rounded-full ${bgColor}`}>
        <span className={`text-2xl ${iconColor}`}>{icon}</span>
      </div>
    </div>
  );
}