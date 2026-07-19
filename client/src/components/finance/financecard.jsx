export default function FinanceCard({
  title,
  amount,
  change,
  icon,
  bgColor,
  iconColor,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-2 m-2  w-39 justify-between items-center flex flex-col">
      <div className="flex">
        <p className="text-gray-500 ">{title}</p>
        <div className={`p-2 ml-4 rounded-full ${bgColor}`}>
        <span className={iconColor}>{icon}</span>
       </div>
        
       
      </div>
    <h2 className="text-xl font-bold">₹{amount}</h2>
      
    </div>
  );
}