import { useEffect, useState } from "react";
import {
  FaRobot,
  FaSeedling,
  FaFlask,
  FaArrowDown,
  FaTags,
  FaRotateRight,
} from "react-icons/fa6";
import { FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { getExpenseRecommendations } from "../../api/ai";

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function AIExpenseAdvisor({ refreshKey }) {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchRecommendations() {
    setLoading(true);
    setError("");
    try {
      const data = await getExpenseRecommendations();
      setAdvice(data);
    } catch (err) {
      console.error("AI Advisor Error:", err);
      setError(err.message || "Failed to load financial recommendations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecommendations();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 flex flex-col items-center justify-center py-12 text-slate-400">
        <FaRobot className="text-3xl text-emerald-600 animate-bounce mb-3" />
        <p className="text-sm font-semibold text-slate-700 animate-pulse">
          Analyzing input expenses with Gemini AI...
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Identifying cheaper fertilizer and pesticide alternatives with current market prices
        </p>
      </div>
    );
  }

  if (error || !advice) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
        <p className="text-red-700 text-sm font-semibold">{error || "No data available."}</p>
        <button
          onClick={fetchRecommendations}
          className="mt-2 text-xs font-bold text-red-600 hover:underline cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const o = advice.financialOverview;
  const topExpenses = (advice.highestExpenses || []).slice(0, 3);
  const alternatives = advice.costSavingAlternatives || [];

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-100 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white p-2.5 rounded-xl shadow-sm">
            <FaRobot className="text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              AI Expense Advisor
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Gemini AI
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Input cost reduction & high-value generic replacements
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchRecommendations}
          disabled={loading}
          title="Refresh AI suggestions"
          className="text-slate-400 hover:text-emerald-600 p-2 rounded-lg hover:bg-emerald-50 transition cursor-pointer disabled:opacity-50"
        >
          <FaRotateRight className={`text-xs ${loading ? "animate-spin text-emerald-600" : ""}`} />
        </button>
      </div>

      {/* Financial Health Mini Bar */}
      {o && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3">
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Total Income</p>
            <p className="font-extrabold text-blue-900 text-base sm:text-lg mt-0.5">
              {inr(o.totalIncome)}
            </p>
          </div>
          <div className="bg-red-50/80 border border-red-100 rounded-xl p-3">
            <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Total Expenses</p>
            <p className="font-extrabold text-red-900 text-base sm:text-lg mt-0.5">
              {inr(o.totalExpenses)}
            </p>
          </div>
          <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-3">
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Net Profit</p>
            <p className="font-extrabold text-emerald-900 text-base sm:text-lg mt-0.5">
              {inr(o.netProfit)}
            </p>
          </div>
        </div>
      )}

      {/* Top Recorded Outlays */}
      {topExpenses.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Top Outlays:
          </span>
          {topExpenses.map((e, i) => (
            <span
              key={i}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-2xs"
            >
              {e.name} · <b className="text-slate-900">{inr(e.amount)}</b> ({e.percentage}%)
            </span>
          ))}
        </div>
      )}

      {/* COST-CUTTING PESTICIDE & FERTILIZER RECOMMENDATIONS WITH PRICES */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <FaFlask className="text-emerald-600" />
            Recommended Pesticide & Fertilizer Cost-Cutters
          </h3>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Cheaper Good-Quality Options
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alternatives.map((alt, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-b from-white to-slate-50/70 border border-emerald-100 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between gap-2.5 hover:border-emerald-300 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {alt.category}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {alt.badge}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 leading-snug">
                  {alt.title}
                </h4>

                <div className="mt-2 space-y-1 text-[11px]">
                  <div className="flex items-start gap-1 text-slate-500">
                    <span className="text-slate-400 shrink-0 font-medium">Standard:</span>
                    <span className="line-through text-slate-400">{alt.currentPractice}</span>
                  </div>

                  <div className="flex items-start gap-1 text-emerald-900 font-semibold bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-100/60">
                    <FaCheckCircle className="text-emerald-600 text-xs shrink-0 mt-0.5" />
                    <span>{alt.recommendation}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Market Price</span>
                  <span className="font-extrabold text-slate-800">{alt.priceRange}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-600 block font-bold">Estimated Benefit</span>
                  <span className="font-extrabold text-emerald-700">{alt.estimatedSavings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GEMINI AI DYNAMIC ADVICE */}
      {advice.aiAdvice ? (
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-xl p-4 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-emerald-700/60 pb-2">
            <h3 className="font-bold text-xs flex items-center gap-2 text-emerald-200 uppercase tracking-wider">
              <FaSeedling className="text-emerald-300" />
              Gemini AI Tailored Expense Advice
            </h3>
            <span className="text-[10px] font-semibold bg-emerald-900/60 px-2 py-0.5 rounded-full text-emerald-200">
              Personalized
            </span>
          </div>
          <div className="text-xs leading-relaxed text-emerald-50 whitespace-pre-line space-y-1.5">
            {advice.aiAdvice}
          </div>
        </div>
      ) : null}
    </div>
  );
}
