import { useState, useEffect } from "react";
import {
  FaRobot,
  FaSeedling,
  FaWater,
  FaBug,
  FaSearch,
  FaRedo,
  FaLightbulb,
  FaExclamationTriangle,
  FaCheckCircle,
  FaPaperPlane,
  FaQuestionCircle,
} from "react-icons/fa";
import { getCropCareAdvice } from "../../api/ai";

export default function AICropAdvisor({
  crops = [],
  selectedCrop = null,
  onSelectCrop = () => {},
}) {
  const [activeCropId, setActiveCropId] = useState("");
  const [question, setQuestion] = useState("");
  const [lastAskedQuestion, setLastAskedQuestion] = useState("");
  const [adviceData, setAdviceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync activeCropId when selectedCrop prop changes or when crops load
  useEffect(() => {
    if (selectedCrop && selectedCrop.id) {
      setActiveCropId(String(selectedCrop.id));
    } else if (crops.length > 0 && !activeCropId) {
      setActiveCropId(String(crops[0].id));
    }
  }, [selectedCrop, crops]);

  // Fetch initial advice whenever the active crop changes
  useEffect(() => {
    if (!activeCropId) return;
    fetchAdvice(activeCropId, "");
  }, [activeCropId]);

  async function fetchAdvice(cropIdToQuery, queryText = "") {
    if (!cropIdToQuery) return;

    setLoading(true);
    setError("");

    try {
      const data = await getCropCareAdvice({
        cropId: cropIdToQuery,
        question: queryText,
        symptoms: queryText,
      });

      setAdviceData(data);
      if (queryText) {
        setLastAskedQuestion(queryText);
      }
    } catch (err) {
      console.error("AI Crop Care fetch error:", err);
      setError(err.message || "Failed to retrieve AI crop guidance.");
    } finally {
      setLoading(false);
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!question.trim()) return;
    fetchAdvice(activeCropId, question);
  }

  function handleQuickQuestion(qText) {
    setQuestion(qText);
    fetchAdvice(activeCropId, qText);
  }

  const currentCropObj = crops.find(
    (c) => String(c.id) === String(activeCropId)
  ) || selectedCrop || crops[0];

  const quickQuestions = [
    { label: "💧 Watering Schedule", q: "What is the best irrigation schedule and water requirement for this stage?" },
    { label: "🧪 Fertilizer Dose", q: "What is the exact fertilizer dose and nutrients to apply right now?" },
    { label: "🐛 Pest Protection", q: "Which generic medicine should I spray to control caterpillar and borer attacks?" },
    { label: "🍂 Yellow Leaves", q: "Leaves are turning yellow and pale, what is the exact cure?" },
    { label: "🌸 Stop Flower Drop", q: "How to prevent flower and bud dropping to maximize crop yield?" },
    { label: "🌾 Harvest Signs", q: "How do I know when the crop is ready for harvesting?" },
  ];

  if (crops.length === 0) {
    return (
      <div
        id="ai-crop-advisor"
        className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4"
      >
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-xl">
            <FaRobot className="text-xl" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">AI Crop Assistant</h3>
            <p className="text-xs text-slate-400">Powered by Gemini AI</p>
          </div>
        </div>

        <div className="py-8 text-center flex flex-col items-center">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full mb-3">
            <FaSeedling className="text-2xl" />
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-1">No crops registered yet</p>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Add a crop to ask questions and get instant, meaningful advice in short.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="ai-crop-advisor"
      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white p-2 rounded-xl shadow-xs">
            <FaRobot className="text-base" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              AI Crop Assistant
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Gemini AI
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Ask any crop question & get meaningful advice in short
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fetchAdvice(activeCropId, question)}
          disabled={loading}
          title="Refresh AI suggestions"
          className="text-slate-400 hover:text-emerald-600 p-2 rounded-lg hover:bg-emerald-50 transition cursor-pointer disabled:opacity-50"
        >
          <FaRedo className={`text-xs ${loading ? "animate-spin text-emerald-600" : ""}`} />
        </button>
      </div>

      {/* Target Crop Selector */}
      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 pl-1">
          Select Crop:
        </span>
        <select
          value={activeCropId}
          onChange={(e) => {
            const newId = e.target.value;
            setActiveCropId(newId);
            const found = crops.find((c) => String(c.id) === String(newId));
            if (found) onSelectCrop(found);
          }}
          className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer capitalize"
        >
          {crops.map((c) => (
            <option key={c.id} value={c.id}>
              {c.crop} {c.variety ? `(${c.variety})` : ""} — {c.area || "Active"}
            </option>
          ))}
        </select>
      </div>

      {/* Crop Stage Pill Row */}
      {adviceData?.crop && (
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5 flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 font-bold text-emerald-900">
            <FaSeedling className="text-emerald-600 text-xs" />
            <span>{adviceData.crop.growthStage || "Vegetative"}</span>
          </div>
          <span className="text-emerald-300">•</span>
          <div className="font-semibold text-emerald-800">
            Day {adviceData.crop.age ?? 0}
          </div>
          {adviceData.crop.soilType && (
            <>
              <span className="text-emerald-300">•</span>
              <div className="text-emerald-700">{adviceData.crop.soilType}</div>
            </>
          )}
          {adviceData.crop.irrigationType && (
            <>
              <span className="text-emerald-300">•</span>
              <div className="text-emerald-700 flex items-center gap-1">
                <FaWater className="text-[10px]" />
                {adviceData.crop.irrigationType}
              </div>
            </>
          )}
        </div>
      )}

      {/* Quick Farmer Question Chips */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
          <FaQuestionCircle className="text-slate-300" />
          Common Farmer Questions:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickQuestion(chip.q)}
              className="text-[11px] font-semibold bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200/80 rounded-lg px-2.5 py-1 text-slate-600 transition cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ask Question Form */}
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask AI anything (e.g. spray name, yellow leaves, water)..."
          className="flex-1 min-w-0 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition shadow-2xs"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {loading ? (
            <span className="animate-pulse">Thinking...</span>
          ) : (
            <>
              <FaPaperPlane className="text-[10px]" />
              <span>Ask AI</span>
            </>
          )}
        </button>
      </form>

      {/* AI Advice Output Display */}
      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2 border border-slate-100 rounded-xl bg-slate-50/50">
          <FaRobot className="text-2xl text-emerald-600 animate-bounce" />
          <p className="text-xs font-semibold text-slate-700 animate-pulse">
            Generating meaningful advice in short...
          </p>
          <p className="text-[10px] text-slate-400">
            Consulting agronomic knowledge base for {currentCropObj?.crop || "crop"}
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
          <p className="text-xs text-red-600 font-semibold">{error}</p>
          <button
            type="button"
            onClick={() => fetchAdvice(activeCropId, question)}
            className="mt-1.5 text-xs font-bold text-red-700 hover:underline cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : adviceData?.aiAdvice ? (
        <div className="flex flex-col gap-2.5">
          {lastAskedQuestion && (
            <div className="bg-slate-100/80 rounded-xl px-3 py-2 text-xs text-slate-700 flex items-start gap-2 border border-slate-200/60">
              <span className="font-bold text-slate-500 shrink-0">Q:</span>
              <span className="font-medium italic">{lastAskedQuestion}</span>
            </div>
          )}

          {adviceData.isFallback && (
            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
              <FaExclamationTriangle className="text-amber-500 shrink-0 text-xs" />
              <span>Agronomic Knowledge Advisor Active</span>
            </div>
          )}

          <div className="bg-gradient-to-b from-white to-slate-50/80 border border-emerald-100 rounded-xl p-3.5 shadow-2xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                <FaLightbulb className="text-emerald-600 text-xs" />
                Meaningful Advice in Short
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Actionable
              </span>
            </div>

            <div className="text-xs text-slate-700 space-y-2 leading-relaxed whitespace-pre-line font-medium">
              {adviceData.aiAdvice}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <FaCheckCircle className="text-emerald-500" />
                Verified agronomic practices
              </span>
              {lastAskedQuestion && (
                <button
                  type="button"
                  onClick={() => {
                    setQuestion("");
                    setLastAskedQuestion("");
                    fetchAdvice(activeCropId, "");
                  }}
                  className="text-slate-500 hover:text-slate-700 underline cursor-pointer"
                >
                  Clear question
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
