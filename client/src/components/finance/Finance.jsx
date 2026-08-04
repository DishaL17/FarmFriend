import FinanceCard from "./financecard";
import {
  FaArrowTrendUp,
  FaWallet,
  FaMoneyBillWave,
  FaPlus,
} from "react-icons/fa6";
import { useState } from "react";
import TransactionModal from "./Transactions";

export default function Finance({ transactions = [], crops = [], onTransactionAdded }) {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const totalIncome = transactions
    .filter((t) => t.type && t.type.toLowerCase() === "income")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type && t.type.toLowerCase() === "expense")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const netProfit = totalIncome - totalExpense;

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
        {isTransactionModalOpen && (
          <TransactionModal
            onClose={() => setIsTransactionModalOpen(false)}
            onSuccess={() => {
              setIsTransactionModalOpen(false);
              if (onTransactionAdded) onTransactionAdded();
            }}
          />
        )}
      </div>

      <div className="space-y-6">
        {/* Finance Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-6 p-2">
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