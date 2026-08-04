import { FaHistory, FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function RecentTransactions({ transactions = [], loading = false }) {
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

  return (
    <div className="bg-white rounded-2xl shadow-md p-4  border border-slate-100 flex flex-col h-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
          <FaHistory className="text-lg" />
        </span>
        Recent Transactions
      </h2>

      {loading ? (
        <p className="text-center py-6 text-slate-500">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p className="font-medium">No transactions recorded yet.</p>
          <p className="text-sm mt-1">Use the "Add Transaction" button to record one!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-3.5 px-4 text-sm font-semibold text-slate-700 capitalize">
                    {t.name}
                  </td>
                  <td className="py-3.5 px-4 text-sm">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        t.type.toLowerCase() === "income"
                          ? "bg-green-50 text-green-700 border border-green-150"
                          : "bg-red-50 text-red-700 border border-red-150"
                      }`}
                    >
                      {t.type.toLowerCase() === "income" ? (
                        <FaArrowUp className="text-[10px]" />
                      ) : (
                        <FaArrowDown className="text-[10px]" />
                      )}
                      {t.type}
                    </span>
                  </td>
                  <td
                    className={`py-3.5 px-4 text-sm font-bold ${
                      t.type.toLowerCase() === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {t.type.toLowerCase() === "income" ? "+" : "-"} ₹{t.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-slate-500">
                    {formatDate(t.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}