import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaChartPie,
  FaChevronLeft,
  FaChevronRight,
  FaSeedling,
} from "react-icons/fa";

const COLORS = [
  "#059669",
  "#10b981",
  "#34d399",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6366f1",
];

const renderPercent = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (percent < 0.07) return null;
  const RAD = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      fontSize={11}
      fontWeight={700}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
};

export default function ExpensePieChart({
  transactions = [],
  crops = [],
  loading = false,
}) {
  // Extract unique crop names available in transactions or crops
  const cropList = useMemo(() => {
    const set = new Set();
    crops.forEach((c) => {
      if (c.crop) set.add(c.crop.trim());
    });
    transactions.forEach((t) => {
      if (t.crop && t.crop.trim() && t.crop.toLowerCase() !== "general") {
        set.add(t.crop.trim());
      }
    });
    return ["All Crops", ...Array.from(set)];
  }, [crops, transactions]);

  const [selectedCropIndex, setSelectedCropIndex] = useState(0);

  const selectedCrop = cropList[selectedCropIndex] || "All Crops";

  // Calculate expense breakdown specifically for the selected crop
  const chartData = useMemo(() => {
    const isAll = selectedCrop === "All Crops";
    const totals = {};

    transactions
      .filter((t) => {
        const isExpense = String(t.type || "").toLowerCase() === "expense";
        if (!isExpense) return false;
        if (isAll) return true;
        return (
          String(t.crop || "").trim().toLowerCase() ===
          selectedCrop.trim().toLowerCase()
        );
      })
      .forEach((t) => {
        const key = String(t.name || "Other").trim();
        totals[key] = (totals[key] || 0) + Number(t.amount || 0);
      });

    const entries = Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return entries;
  }, [transactions, selectedCrop]);

  const totalExpense = chartData.reduce(
    (sum, d) => sum + Number(d.value || 0),
    0
  );

  function handlePrevCrop() {
    setSelectedCropIndex((prev) =>
      prev === 0 ? cropList.length - 1 : prev - 1
    );
  }

  function handleNextCrop() {
    setSelectedCropIndex((prev) =>
      prev === cropList.length - 1 ? 0 : prev + 1
    );
  }

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 p-2 rounded-xl text-emerald-700 flex items-center justify-center">
            <FaChartPie className="text-sm" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800 leading-tight">
              Crop Expense Breakdown
            </h2>
            <p className="text-xs text-slate-400">
              Showing: <span className="font-bold text-emerald-700">{selectedCrop}</span>
            </p>
          </div>
        </div>

        <span className="text-xs font-extrabold text-slate-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl">
          ₹{totalExpense.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Chart Section - Guaranteed Fully Visible */}
      {loading ? (
        <div className="h-[280px] flex items-center justify-center text-slate-400 text-xs">
          Loading chart data...
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-[280px] flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
          <FaSeedling className="text-3xl text-emerald-300 mb-2" />
          <p className="font-bold text-slate-700">No expenses recorded for {selectedCrop}</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
            Shift or swap to another crop below or record expenses using Add Transaction.
          </p>
        </div>
      ) : (
        <div className="w-full h-[290px] py-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="44%"
                innerRadius={48}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                label={renderPercent}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: "11px",
                  paddingTop: "6px",
                  maxHeight: "56px",
                  overflowY: "auto",
                }}
                formatter={(value, entry) => (
                  <span className="text-slate-700 font-medium">
                    {value} (₹
                    {Number(entry.payload.value).toLocaleString("en-IN")})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* BOTTOM CROP SHIFT / SWAPPER LINE */}
      <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 mt-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">
            Shift Crop:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevCrop}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition cursor-pointer"
              title="Previous Crop"
            >
              <FaChevronLeft className="text-[10px]" />
            </button>
            <span className="text-[11px] text-slate-600 font-extrabold px-1">
              {selectedCropIndex + 1} / {cropList.length}
            </span>
            <button
              type="button"
              onClick={handleNextCrop}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition cursor-pointer"
              title="Next Crop"
            >
              <FaChevronRight className="text-[10px]" />
            </button>
          </div>
        </div>

        {/* Clickable Crop Pills Line */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {cropList.map((cropName, index) => {
            const isSelected = index === selectedCropIndex;
            return (
              <button
                key={cropName}
                type="button"
                onClick={() => setSelectedCropIndex(index)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {cropName}
              </button>
            );
          })}
        </div>

        {/* Visual Continuous Swapper Indicator Line */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{
              width: `${((selectedCropIndex + 1) / cropList.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
