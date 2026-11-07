import { useEffect, useState } from "react";
import { FaFlask, FaRotateRight, FaTags, FaPercent, FaSeedling } from "react-icons/fa6";
import { getPesticidePrices } from "../../api/ai";

export default function PesticidePriceCard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getPesticidePrices();
      setItems(data.pesticides || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load live input rates. Please verify connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const categories = ["All", "Fertilizer", "Pesticide", "Bio-Pesticide", "Fungicide"];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 border border-slate-100 h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="bg-emerald-100 p-2 rounded-xl text-emerald-700 flex items-center justify-center shrink-0">
              <FaFlask className="text-base" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
                Pesticide & Fertilizer Rates
              </h3>
              <p className="text-xs text-slate-400">
                Market benchmarks & cost-saving generic alternatives
              </p>
            </div>
          </div>

          <button
            onClick={load}
            disabled={loading}
            className="text-slate-400 hover:text-emerald-600 p-2 rounded-lg hover:bg-emerald-50 transition disabled:opacity-50 cursor-pointer"
            title="Refresh Market Prices"
          >
            <FaRotateRight className={`text-xs ${loading ? "animate-spin text-emerald-600" : ""}`} />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
          {loading && (
            <div className="py-8 text-center text-slate-400">
              <p className="text-xs animate-pulse">Loading input benchmark prices...</p>
            </div>
          )}

          {error && (
            <div className="bg-amber-50 text-amber-700 p-3 rounded-xl text-xs text-center border border-amber-200">
              <p>{error}</p>
              <button
                onClick={load}
                className="mt-1 font-bold text-emerald-700 hover:underline"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            filteredItems.map((p, i) => (
              <div
                key={i}
                className="bg-slate-50/80 hover:bg-emerald-50/40 border border-slate-100 rounded-xl p-3 transition flex flex-col gap-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">
                        {p.name}
                      </span>
                      {p.savings && (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <FaPercent className="text-[8px]" />
                          {p.savings}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{p.use}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-emerald-700 text-xs sm:text-sm">
                      {p.priceRange}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">{p.pack}</p>
                  </div>
                </div>

                {p.cheaperAlternative && (
                  <div className="text-[10.5px] text-emerald-800 bg-emerald-50/70 border border-emerald-100 rounded-lg px-2 py-1 flex items-center gap-1.5 font-medium">
                    <FaTags className="text-emerald-600 text-[10px] shrink-0" />
                    <span>{p.cheaperAlternative}</span>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-2">
        <p className="text-[11px] text-slate-400 leading-snug flex items-center gap-1.5">
          <FaSeedling className="text-emerald-500 shrink-0" />
          <span>Compare dealer rates before buying. Bulk cooperative purchases reduce prices by 8-15%.</span>
        </p>
      </div>
    </div>
  );
}
