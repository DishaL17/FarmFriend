
import { useState, useEffect } from "react";
import {
  FaStore,
  FaMapMarkerAlt,
  FaTag,
  FaSearch,
} from "react-icons/fa";
import { API_BASE_URL } from "../../config/api";

const MANDI_API_URL = `${API_BASE_URL}/api/mandi`;

const DEFAULT_CROP = "Wheat";

const EXTRA_CROPS = ["Potato", "Soyabean"];

export default function MandiPrices({ crops = [] }) {
  const [selectedCrop, setSelectedCrop] = useState("");
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Get unique crop options.
  const cropOptions = [
    ...new Map(
      [
        ...crops.map((c) => c.crop).filter(Boolean),
        ...EXTRA_CROPS,
      ].map((crop) => [
        crop.trim().toLowerCase(),
        crop.trim(),
      ])
    ).values(),
  ];

  // Set the default crop when the available crops change.
  useEffect(() => {
    if (cropOptions.length === 0) {
      setSelectedCrop(DEFAULT_CROP);
      return;
    }

    setSelectedCrop((current) => {
      const existingCrop = cropOptions.find(
        (crop) => crop.toLowerCase() === current.toLowerCase()
      );

      return existingCrop || crops[0]?.crop || DEFAULT_CROP;
    });
  }, [crops]);

  // Fetch mandi prices for the selected crop.
  useEffect(() => {
    if (!selectedCrop) return;

    const controller = new AbortController();

    async function fetchPrices() {
      setLoading(true);
      setError("");
      setPrices([]);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view mandi prices.");
        }

        const formattedCropName =
          selectedCrop.trim().charAt(0).toUpperCase() +
          selectedCrop.trim().slice(1).toLowerCase();

        const response = await fetch(
          `${MANDI_API_URL}/${encodeURIComponent(formattedCropName)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error(
              "Your session may have expired. Please log in again."
            );
          }

          throw new Error(
            `Unable to fetch mandi prices (HTTP ${response.status}).`
          );
        }

        const data = await response.json();

        // Support either an array or an object containing a data array.
        const records = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        setPrices(records);

        console.log("Mandi prices received:", records);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Failed to load mandi prices:", err);

        setError(
          err.message || "Failed to retrieve mandi prices. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPrices();

    return () => {
      controller.abort();
    };
  }, [selectedCrop, retryCount]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
            <FaStore className="text-lg" />
          </span>
          Mandi Prices
        </h2>

        {/* Crop selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Crop:
          </span>

          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer capitalize"
          >
            {!cropOptions.some(
              (crop) => crop.toLowerCase() === DEFAULT_CROP.toLowerCase()
            ) && (
              <option value={DEFAULT_CROP}>
                {DEFAULT_CROP} (Default)
              </option>
            )}

            {cropOptions.map((crop) => (
              <option key={crop.toLowerCase()} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
          <FaSearch className="text-2xl animate-pulse text-emerald-600" />
          <p className="text-sm font-medium animate-pulse">
            Fetching latest mandi prices...
          </p>
        </div>
      ) : error ? (
        /* Error state */
        <div className="text-center py-12">
          <p className="text-red-500 text-sm font-medium">{error}</p>

          <button
            type="button"
            onClick={() => setRetryCount((c) => c + 1)}
            className="mt-3 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : prices.length === 0 ? (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-400">
          <FaStore className="text-3xl mb-3 text-slate-300" />

          <p className="font-semibold text-slate-500">
            No mandi prices found.
          </p>

          <p className="text-xs mt-1 max-w-[280px]">
            There are no available price records for{" "}
            <span className="capitalize font-bold text-slate-600">
              {selectedCrop}
            </span>
            .
          </p>
        </div>
      ) : (
        /* Mandi price records */
        <div className="overflow-y-auto flex-1 max-h-[300px] pr-1">
          <div className="space-y-3">
            {prices.map((p, index) => (
              <div
                key={
                  p.id ??
                  `${p.Market}-${p.District}-${p.Arrival_Date}-${index}`
                }
                className="border border-slate-100 bg-slate-50/50 rounded-xl p-3.5 flex justify-between items-center gap-3 hover:bg-slate-50 transition"
              >
                {/* Market information */}
                <div className="flex gap-3 items-start min-w-0">
                  <div className="text-emerald-700 bg-emerald-100 p-2 rounded-lg mt-0.5 shrink-0">
                    <FaMapMarkerAlt className="text-sm" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm break-words">
                      {p.Market || "Unknown Market"}
                    </h4>

                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {[p.District, p.State].filter(Boolean).join(", ") ||
                        "Location unavailable"}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {p.Variety && (
                        <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded font-medium">
                          {p.Variety}
                        </span>
                      )}

                      {p.Grade && p.Grade !== "FAQ" && (
                        <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded font-medium">
                          Grade: {p.Grade}
                        </span>
                      )}

                      {p.Arrival_Date && (
                        <span className="bg-emerald-50 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded font-semibold">
                          Date: {p.Arrival_Date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price information */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1.5 justify-end">
                    <FaTag className="text-[10px] text-emerald-600" />

                    <span className="text-sm font-bold text-emerald-700">
                      ₹
                      {p.Modal_Price != null
                        ? Number(p.Modal_Price).toLocaleString("en-IN")
                        : "N/A"}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Range: ₹{p.Min_Price ?? "N/A"} - ₹
                    {p.Max_Price ?? "N/A"}
                  </p>

                  <p className="text-[9px] text-slate-400">
                    Prices as reported by the market
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

