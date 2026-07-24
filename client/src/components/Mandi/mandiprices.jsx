import { useState, useEffect } from "react";
import { FaStore, FaMapMarkerAlt, FaTag, FaSearch } from "react-icons/fa";

export default function MandiPrices({ crops = [] }) {
  const [selectedCrop, setSelectedCrop] = useState("");
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set default selected crop when crops load
  useEffect(() => {
    if (crops.length > 0) {
      // Default to the first crop
      setSelectedCrop(crops[0].crop);
    } else {
      // Default fallback
      setSelectedCrop("Wheat");
    }
  }, [crops]);

  // Fetch prices when selectedCrop changes
  useEffect(() => {
    if (!selectedCrop) return;

    async function fetchPrices() {
      setLoading(true);
      setError(null);
      try {
        // Capitalize the first letter of the crop name to match the government API filters
        const formattedCropName =
          selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1).toLowerCase();

        const response = await fetch(`http://localhost:5000/api/mandi/${formattedCropName}`);
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const data = await response.json();
        setPrices(data || []);
      } catch (err) {
        console.error("Failed to load mandi prices:", err);
        setError("Failed to retrieve mandi prices.");
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
  }, [selectedCrop]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
            <FaStore className="text-lg" />
          </span>
          Mandi Prices
        </h2>

        {/* Dropdown to switch crops */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Crop:</span>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer capitalize"
          >
            {crops.length === 0 ? (
              <option value="Wheat">Wheat (Demo)</option>
            ) : (
              crops.map((c) => (
                <option key={c.id} value={c.crop}>
                  {c.crop}
                </option>
              ))
            )}
            {/* Fallbacks if user wants to check other common crops */}
            <option value="Potato">Potato</option>
            <option value="Soyabean">Soyabean</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
          <FaSearch className="text-2xl animate-pulse text-emerald-600" />
          <p className="text-sm font-medium animate-pulse">Fetching latest mandi prices...</p>
        </div>
      ) : error ? (
        <p className="text-center py-12 text-red-500 text-sm font-medium">{error}</p>
      ) : prices.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-400">
          <p className="font-semibold text-slate-500">No mandi prices found.</p>
          <p className="text-xs mt-1 max-w-[280px]">
            There are no recent price logs in the central database for <span className="capitalize font-bold text-slate-600">"{selectedCrop}"</span> in your region.
          </p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1 max-h-[300px] pr-1">
          <div className="space-y-3">
            {prices.map((p, index) => (
              <div
                key={index}
                className="border border-slate-100 bg-slate-50/50 rounded-xl p-3.5 flex justify-between items-center hover:bg-slate-50 transition"
              >
                <div className="flex gap-3 items-center">
                  <div className="text-emerald-700 bg-emerald-100 p-2 rounded-lg">
                    <FaMapMarkerAlt className="text-sm" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {p.Market}
                    </h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {p.District}, {p.State}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <FaTag className="text-[10px] text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">
                      ₹{p.Modal_Price}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Range: ₹{p.Min_Price} - ₹{p.Max_Price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}