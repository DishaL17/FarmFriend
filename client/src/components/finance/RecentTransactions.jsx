import { useState } from "react";
import { FaHistory, FaArrowUp, FaArrowDown, FaFilter, FaSeedling } from "react-icons/fa";

export default function RecentTransactions({ transactions = [], loading = false }) {
  const [filterType, setFilterType] = useState("All");

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "All") return true;
    return t.type?.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 border border-slate-100 flex flex-col h-full">
      {/* Header and Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-emerald-100 p-2 rounded-xl text-emerald-700 flex items-center justify-center">
            <FaHistory className="text-sm" />
          </span>
          Recent Transactions
        </h2>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
          {["All", "Income", "Expense"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filterType === type
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">
          <p className="text-xs animate-pulse">Loading transaction records...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p className="font-semibold text-xs text-slate-600">No transactions found</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {filterType === "All"
              ? "Use the 'Add Transaction' button above to track farm income or expenses."
              : `No ${filterType.toLowerCase()} records found.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[360px] overflow-y-auto pr-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="py-2.5 px-3">Transaction</th>
                <th className="py-2.5 px-3">Crop</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {filteredTransactions.slice(0, 10).map((t) => {
                const isIncome = t.type?.toLowerCase() === "income";
                return (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {t.name}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        <FaSeedling className="text-[9px] text-emerald-600" />
                        {t.crop || "General"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isIncome
                            ? "bg-green-100 text-green-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {isIncome ? (
                          <FaArrowUp className="text-[8px]" />
                        ) : (
                          <FaArrowDown className="text-[8px]" />
                        )}
                        {t.type}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-extrabold ${
                        isIncome ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"}₹
                      {Number(t.amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 text-[11px]">
                      {formatDate(t.date)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
