import FinanceCard from "./financecard";
import {
  FaArrowTrendUp,
  FaWallet,
  FaMoneyBillWave,
  FaSeedling,
  FaPlus,
} from "react-icons/fa6";

export default function Finance({ transactions = [], crops = [] }) {
  // Calculate dynamic totals from transactions
  
  const totalIncome = transactions
    .filter((t) => t.type && t.type.toLowerCase() === "income")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type && t.type.toLowerCase() === "expense")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const netProfit = totalIncome - totalExpense;

  // Compile crop-wise profit data
  const activeCropNames = crops.map((c) => c.crop.toLowerCase());
  const transactionCropNames = transactions
    .map((t) => t.crop && t.crop.toLowerCase())
    .filter((name) => name && name !== "general");

  const uniqueCropNames = Array.from(
    new Set([...activeCropNames, ...transactionCropNames])
  );

  const cropProfits = uniqueCropNames.map((cropName) => {
    const cropTransactions = transactions.filter(
      (t) => t.crop && t.crop.toLowerCase() === cropName
    );

    const income = cropTransactions
      .filter((t) => t.type && t.type.toLowerCase() === "income")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const expense = cropTransactions
      .filter((t) => t.type && t.type.toLowerCase() === "expense")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    return {
      name: cropName,
      income,
      expense,
      profit: income - expense,
    };
  });

  return (
    <section>
      <div className="flex justify-between items-center text-slate-800 text-xl font-bold px-3">
                  <h2>Financial Overview</h2>
                  <button
                    onClick={() => setIsTransactionModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <FaPlus className="text-xs" />
                    Add Transaction
                  </button>
                </div>

    <div className="space-y-6">
      {/* Finance Cards Grid */}
      <div className=" flex-wrap sm:flex gap-6 m-1 items-center justify-between ">
        <FinanceCard
          title="Income"
          amount={totalIncome}
          icon={<FaMoneyBillWave />}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <FinanceCard
          title="Expense"
          amount={totalExpense}
          icon={<FaWallet />}
          bgColor="bg-red-100"
          iconColor="text-red-600"
        />

        <FinanceCard
          title="Net Profit"
          amount={netProfit}
  
          icon={<FaArrowTrendUp />}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />

        
      </div>

     
    </div>
    </section>
  );
}