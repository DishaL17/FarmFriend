export default function FinanceCard({
  title,
  amount,
  change,
  icon,
  bgColor,
  iconColor,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-2 m-2 flex justify-between items-center">
      <div>
        <p className="text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold">₹{amount}</h2>
       
      </div>

      <div className={`p-4 rounded-full ${bgColor}`}>
        <span className={iconColor}>{icon}</span>
      </div>
    </div>
  );
}