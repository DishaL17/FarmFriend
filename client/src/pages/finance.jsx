import { useState, useEffect, useMemo } from "react";
import {
  FaPlus,
  FaWallet,
  FaArrowTrendUp,
  FaMoneyBillWave,
  FaCoins,
} from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import Nav from "../components/nav+side/nav";
import Sidebar from "../components/nav+side/sidebar";
import ExpensePieChart from "../components/finance/ExpensePieChart";
import RecentTransactions from "../components/finance/RecentTransactions";
import AIExpenseAdvisor from "../components/finance/AIExpenseAdvisor";
import TransactionModal from "../components/finance/Transactions";
import { getTransactions } from "../api/transaction";
import { getCrops } from "../api/crop";

export default function Finance() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiRefreshKey, setAiRefreshKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setCurrentUser(stored);
    } catch (e) {
      console.error(e);
    }
    loadFinanceData();
  }, []);

  async function loadFinanceData() {
    try {
      setLoading(true);

      const [transactionData, cropData] = await Promise.all([
        getTransactions(),
        getCrops(),
      ]);

      if (transactionData.success) {
        setTransactions(transactionData.transactions || []);
      }

      if (cropData.success) {
        setCrops(cropData.crops || []);
      }
    } catch (err) {
      console.error("Finance data loading failed:", err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate totals
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => String(t.type).toLowerCase() === "income")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => String(t.type).toLowerCase() === "expense")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [transactions]);

  const netProfit = totalIncome - totalExpense;
  const profitMargin =
    totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0;

  function handleTransactionAdded() {
    loadFinanceData();
    setAiRefreshKey((k) => k + 1);
  }

  return (
    <div className="flex min-h-screen bg-lime-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col lg:ml-64 bg-lime-50 min-w-0">
        <Nav setIsSidebarOpen={setIsSidebarOpen} />

        <div className="flex-1 p-4 sm:p-6 space-y-6">
          {/* Top Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 p-2 rounded-xl text-emerald-700">
                  <FaWallet className="text-lg" />
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                  Farm Finance
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time crop balance, transactions, expense analytics & AI advice
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {currentUser?.isDemo && (
                <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <FaInfoCircle className="text-xs text-amber-600" />
                  Demo Mode (View Only)
                </span>
              )}

              <button
                onClick={() => setShowModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
              >
                <FaPlus className="text-xs" />
                <span>Add Transaction</span>
              </button>
            </div>
          </div>

          {/* MAIN 2 EQUAL HALVES GRID (LEFT & RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* LEFT HALF (50%) */}
            <div className="flex flex-col gap-6 min-w-0">
              {/* 1. 2x2 Grid of Finance Cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Total Income Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Total Income
                    </p>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 mt-0.5">
                      ₹{totalIncome.toLocaleString("en-IN")}
                    </h3>
                    <p className="text-[10px] font-semibold text-emerald-600">
                      Mandi Sales & Schemes
                    </p>
                  </div>
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl text-lg shrink-0">
                    <FaMoneyBillWave />
                  </div>
                </div>

                {/* Total Expenses Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Total Expenses
                    </p>
                    <h3 className="text-lg sm:text-xl font-extrabold text-rose-600 mt-0.5">
                      ₹{totalExpense.toLocaleString("en-IN")}
                    </h3>
                    <p className="text-[10px] font-semibold text-slate-400">
                      Inputs & Labor
                    </p>
                  </div>
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl text-lg shrink-0">
                    <FaCoins />
                  </div>
                </div>

                {/* Net Profit Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Net Profit
                    </p>
                    <h3
                      className={`text-lg sm:text-xl font-extrabold mt-0.5 ${
                        netProfit >= 0 ? "text-emerald-700" : "text-rose-600"
                      }`}
                    >
                      {netProfit >= 0 ? "+" : "-"}₹
                      {Math.abs(netProfit).toLocaleString("en-IN")}
                    </h3>
                    <p className="text-[10px] font-semibold text-emerald-600">
                      Operating Return
                    </p>
                  </div>
                  <div
                    className={`p-2.5 rounded-xl text-lg shrink-0 ${
                      netProfit >= 0
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    <FaArrowTrendUp />
                  </div>
                </div>

                {/* Profit Margin Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Profit Margin
                    </p>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 mt-0.5">
                      {profitMargin}%
                    </h3>
                    <p className="text-[10px] font-semibold text-slate-500">
                      Efficiency Rating
                    </p>
                  </div>
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl text-lg shrink-0">
                    <FaWallet />
                  </div>
                </div>
              </div>

              {/* 2. Add Transaction Button */}
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <FaPlus className="text-xs" />
                <span>Add Transaction</span>
              </button>

              {/* 3. Recent Transactions */}
              <RecentTransactions
                transactions={transactions}
                loading={loading}
              />

              {/* 4. Expense Card with Crop-Specific Fully Visible Pie Chart & Bottom Crop Swapper Line */}
              <ExpensePieChart
                transactions={transactions}
                crops={crops}
                loading={loading}
              />
            </div>

            {/* RIGHT HALF (50%): Full AI Advice Card */}
            <div className="flex flex-col gap-6 min-w-0">
              <AIExpenseAdvisor refreshKey={aiRefreshKey} />
            </div>
          </div>
        </div>
      </main>

      {/* Pop-up Transaction Modal when clicking Add Transaction */}
      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSuccess={handleTransactionAdded}
        />
      )}
    </div>
  );
}
