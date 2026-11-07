import { useState } from "react";
import {
  FaCalendarAlt,
  FaSeedling,
  FaRupeeSign,
  FaLeaf,
  FaPagelines,
  FaSpa,
  FaTractor,
  FaMap,
  FaRobot,
  FaCheckCircle,
  FaClock,
  FaSlidersH,
  FaInfoCircle,
  FaCheck,
} from "react-icons/fa";
import { markCropAsHarvested } from "../../api/crop";

export default function Cropcard({ crop, onGetAiAdvice, onCropHarvested }) {
  const [showTransitions, setShowTransitions] = useState(false);
  const [simulatedStageIndex, setSimulatedStageIndex] = useState(null);
  const [localStatus, setLocalStatus] = useState(crop.status || "Active");
  const [harvestLoading, setHarvestLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStageInfo = () => {
    if (!crop.date) return { index: 0, diffDays: 0, sprout: 7, vegetative: 30, flowering: 60, harvest: 100 };

    const sowedDate = new Date(crop.date);
    const currentDate = new Date();

    sowedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const diffTime = currentDate.getTime() - sowedDate.getTime();
    const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    const sprout = crop.sprout_day ?? 7;
    const vegetative = crop.vegetative_day ?? 30;
    const flowering = crop.flowering_day ?? 60;
    const harvest = crop.harvest_day ?? 100;

    let index = 0; // Seed
    if (diffDays >= harvest) {
      index = 4; // Harvest
    } else if (diffDays >= flowering) {
      index = 3; // Flowering
    } else if (diffDays >= vegetative) {
      index = 2; // Vegetative
    } else if (diffDays >= sprout) {
      index = 1; // Sprout
    }

    return { index, diffDays, sprout, vegetative, flowering, harvest, sowedDate };
  };

  const {
    index: calculatedIndex,
    diffDays,
    sprout,
    vegetative,
    flowering,
    harvest,
    sowedDate,
  } = getStageInfo();

  const isHarvested = localStatus === "Harvested";

  // Active index (supports previewing state transitions or forced 4 if harvested)
  const activeIndex = isHarvested
    ? 4
    : simulatedStageIndex !== null
    ? simulatedStageIndex
    : calculatedIndex;

  // Calculate specific milestone calendar dates for real state transitions
  const addDaysToDate = (baseDate, days) => {
    if (!baseDate) return "N/A";
    const d = new Date(baseDate);
    d.setDate(d.getDate() + days);
    return formatDate(d);
  };

  const stageMilestones = [
    {
      stage: "Sowing",
      label: "Seed Sown",
      day: 0,
      date: formatDate(crop.date),
      icon: FaSeedling,
      description: "Direct seeding into prepared field bed with basal nutrition.",
      status: activeIndex >= 0 ? "Completed" : "Upcoming",
    },
    {
      stage: "Sprout",
      label: "Germination & Emergence",
      day: sprout,
      date: addDaysToDate(sowedDate, sprout),
      icon: FaLeaf,
      description: "Seedling emergence & first crown root anchor.",
      status: activeIndex > 1 ? "Completed" : activeIndex === 1 ? "Active Stage" : "Upcoming",
    },
    {
      stage: "Vegetative",
      label: "Active Tillering / Branching",
      day: vegetative,
      date: addDaysToDate(sowedDate, vegetative),
      icon: FaPagelines,
      description: "Rapid foliage development, stem elongation & maximum nutrient uptake.",
      status: activeIndex > 2 ? "Completed" : activeIndex === 2 ? "Active Stage" : "Upcoming",
    },
    {
      stage: "Flowering",
      label: "Flowering & Pod Setting",
      day: flowering,
      date: addDaysToDate(sowedDate, flowering),
      icon: FaSpa,
      description: "Bud formation, pollination and grain/pod development.",
      status: activeIndex > 3 ? "Completed" : activeIndex === 3 ? "Active Stage" : "Upcoming",
    },
    {
      stage: "Harvest",
      label: isHarvested ? "Harvest Completed" : "Physiological Maturity",
      day: harvest,
      date: addDaysToDate(sowedDate, harvest),
      icon: FaTractor,
      description: isHarvested
        ? "Crop produce successfully harvested and stored or sold in Mandi."
        : "Moisture drops below 14%, golden maturity ready for cutting.",
      status: isHarvested ? "Harvested" : activeIndex >= 4 ? "Harvest Ready" : "Upcoming",
    },
  ];

  const stages = [
    { label: "Seed", icon: <FaSeedling /> },
    { label: "Sprout", icon: <FaLeaf /> },
    { label: "Vegetative", icon: <FaPagelines /> },
    { label: "Flowering", icon: <FaSpa /> },
    { label: "Harvest", icon: <FaTractor /> },
  ];

  const currentMilestone = stageMilestones[activeIndex] || stageMilestones[0];

  const getStatus = () => {
    if (isHarvested) {
      return { label: "Harvested", color: "bg-blue-100 text-blue-800 border-blue-200" };
    }
    if (activeIndex >= 4) {
      return { label: "Ready to Harvest", color: "bg-amber-100 text-amber-800 border-amber-200" };
    }
    return { label: "Actively Growing", color: "bg-emerald-50 text-emerald-800 border-emerald-200" };
  };

  const status = getStatus();

  async function handleConfirmHarvest() {
    setHarvestLoading(true);
    try {
      await markCropAsHarvested(crop.id, "Harvested");
      setLocalStatus("Harvested");
      setShowConfirmModal(false);
      if (onCropHarvested) {
        onCropHarvested(crop.id);
      }
    } catch (err) {
      console.error("Failed to mark crop as harvested:", err);
      // Even if API fails (e.g. offline), update in state for seamless user experience
      setLocalStatus("Harvested");
      setShowConfirmModal(false);
      if (onCropHarvested) {
        onCropHarvested(crop.id);
      }
    } finally {
      setHarvestLoading(false);
    }
  }

  async function handleToggleStatus() {
    const nextStatus = isHarvested ? "Active" : "Harvested";
    setHarvestLoading(true);
    try {
      await markCropAsHarvested(crop.id, nextStatus);
      setLocalStatus(nextStatus);
      if (onCropHarvested) {
        onCropHarvested(crop.id);
      }
    } catch (err) {
      console.error("Failed to toggle harvest status:", err);
      setLocalStatus(nextStatus);
      if (onCropHarvested) {
        onCropHarvested(crop.id);
      }
    } finally {
      setHarvestLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col gap-4 group relative">
      {/* Header: Name, Variety & Status */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2.5 rounded-xl group-hover:scale-105 transition-transform ${
              isHarvested
                ? "bg-blue-100 text-blue-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {isHarvested ? <FaCheck className="text-xl" /> : <FaSeedling className="text-xl" />}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 capitalize leading-tight">
              {crop.crop}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-xs text-slate-500">
              {crop.variety && (
                <span className="font-semibold text-slate-600">
                  {crop.variety}
                </span>
              )}
              {crop.soil_type && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>{crop.soil_type}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Info Grid: Area, Sowed On, Costs/Return */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <div className="text-emerald-600 bg-white p-2 rounded-lg shadow-2xs">
            <FaMap className="text-xs" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Area</p>
            <p className="font-extrabold text-slate-800">{crop.area || "Field"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-emerald-600 bg-white p-2 rounded-lg shadow-2xs">
            <FaCalendarAlt className="text-xs" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Sowed</p>
            <p className="font-extrabold text-slate-800">{formatDate(crop.date)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-emerald-600 bg-white p-2 rounded-lg shadow-2xs">
            <FaRupeeSign className="text-xs" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Balance</p>
            <p
              className={`font-extrabold ${
                crop.balance >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {crop.balance >= 0 ? "+" : "-"}₹
              {Math.abs(crop.balance || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Growth Progress & Real State Stepper */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <span>Growth State:</span>
            <span
              className={`font-extrabold ${
                isHarvested ? "text-blue-700" : "text-emerald-700"
              }`}
            >
              {currentMilestone.label}
            </span>
          </div>
          <span
            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
              isHarvested
                ? "bg-blue-100 text-blue-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {isHarvested ? "100% Completed" : `Day ${simulatedStageIndex !== null ? currentMilestone.day : diffDays} of ${harvest}`}
          </span>
        </div>

        {/* Stepper bar */}
        <div className="relative flex items-center justify-between w-full py-1">
          {/* Connector Line */}
          <div className="absolute left-4 right-4 top-4.5 h-[3px] bg-slate-100 z-0 rounded-full">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isHarvested ? "bg-blue-600" : "bg-emerald-500"
              }`}
              style={{ width: `${(activeIndex / 4) * 100}%` }}
            />
          </div>

          {/* Stepper Nodes */}
          {stages.map((stage, idx) => {
            const isCompleted = idx < activeIndex || isHarvested;
            const isActive = idx === activeIndex;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSimulatedStageIndex(idx)}
                title={`Click to preview ${stage.label} transition`}
                className="relative z-10 flex flex-col items-center gap-1.5 flex-1 cursor-pointer group/node"
              >
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-300 shadow-xs
                    ${
                      isActive
                        ? isHarvested
                          ? "bg-blue-600 text-white scale-110 ring-4 ring-blue-100 font-bold"
                          : "bg-emerald-600 text-white scale-110 ring-4 ring-emerald-100 font-bold"
                        : ""
                    }
                    ${isCompleted && !isActive ? (isHarvested ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800") : ""}
                    ${!isActive && !isCompleted ? "bg-white border border-slate-200 text-slate-400" : ""}
                  `}
                >
                  <span className={isActive && !isHarvested ? "animate-pulse" : ""}>
                    {stage.icon}
                  </span>
                </div>
                <span
                  className={`
                    text-[9px] font-bold text-center leading-tight
                    ${isActive ? (isHarvested ? "text-blue-700 font-extrabold" : "text-emerald-700 font-extrabold") : "text-slate-400"}
                  `}
                >
                  {stage.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* State Transition Physiological Description */}
        <div
          className={`border rounded-xl p-2.5 text-xs flex items-start gap-2 ${
            isHarvested
              ? "bg-blue-50/70 border-blue-100 text-blue-900"
              : "bg-emerald-50/70 border-emerald-100/90 text-slate-700"
          }`}
        >
          <FaInfoCircle
            className={`text-sm shrink-0 mt-0.5 ${
              isHarvested ? "text-blue-600" : "text-emerald-600"
            }`}
          />
          <div className="flex-1">
            <p className="font-semibold">
              {currentMilestone.description}
            </p>
            <div className="flex items-center justify-between mt-1 text-[11px] opacity-80">
              <span>Transition Date: <b>{currentMilestone.date}</b></span>
              <span>Stage Target: <b>Day {currentMilestone.day}</b></span>
            </div>
          </div>
        </div>
      </div>

      {/* HARVEST CROP ACTION BUTTON */}
      <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
        {isHarvested ? (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-3.5 py-2.5 text-xs text-blue-800">
            <div className="flex items-center gap-2 font-bold">
              <FaCheckCircle className="text-blue-600 text-base" />
              <span>Crop Harvested & Completed</span>
            </div>
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={harvestLoading}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 underline cursor-pointer"
            >
              Revert to Active
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={harvestLoading}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow cursor-pointer ${
              activeIndex >= 4
                ? "bg-amber-500 hover:bg-amber-600 text-white animate-pulse"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            <FaTractor className="text-sm" />
            <span>
              {activeIndex >= 4
                ? "🌾 Crop is Ready to Harvest — Mark as Harvested"
                : "🌾 Mark Crop as Harvested"}
            </span>
          </button>
        )}

        {/* Secondary Action Buttons: State Transitions & AI Advice */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setShowTransitions(!showTransitions)}
            className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <FaSlidersH className="text-slate-500 text-xs" />
            <span>{showTransitions ? "Hide Details" : "State Transitions"}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onGetAiAdvice?.(crop);
            }}
            className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
          >
            <FaRobot className="text-emerald-600 text-xs" />
            <span>Ask AI Advisor</span>
          </button>
        </div>
      </div>

      {/* Real State Transition Detailed Timeline Drawer */}
      {showTransitions && (
        <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3 flex flex-col gap-2.5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FaClock className="text-emerald-600" />
              Real State Transition Timeline
            </span>
            {simulatedStageIndex !== null && (
              <button
                type="button"
                onClick={() => setSimulatedStageIndex(null)}
                className="text-[10px] text-emerald-600 font-bold hover:underline cursor-pointer"
              >
                Reset to Live Day
              </button>
            )}
          </div>

          <div className="space-y-2">
            {stageMilestones.map((m, i) => {
              const isPast = i < activeIndex;
              const isCurrent = i === activeIndex;
              const IconComp = m.icon;

              return (
                <div
                  key={i}
                  onClick={() => setSimulatedStageIndex(i)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 text-xs ${
                    isCurrent
                      ? "bg-white border-emerald-300 shadow-xs"
                      : isPast
                      ? "bg-white/60 border-slate-200/80 text-slate-600"
                      : "bg-slate-100/60 border-slate-200/50 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        isCurrent
                          ? "bg-emerald-600 text-white"
                          : isPast
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {isPast || isHarvested ? <FaCheckCircle className="text-[10px]" /> : <IconComp />}
                    </div>
                    <div>
                      <p className={`font-bold ${isCurrent ? "text-emerald-900" : "text-slate-800"}`}>
                        {m.label}
                      </p>
                      <p className="text-[10px] text-slate-400">Day {m.day} • {m.date}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      isCurrent
                        ? "bg-emerald-100 text-emerald-800"
                        : isPast
                        ? "bg-slate-100 text-slate-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCurrent ? "Active" : isPast ? "Completed" : "Upcoming"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Marking Crop as Harvested */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col gap-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                <FaTractor className="text-2xl" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">
                  Harvest Crop
                </h3>
                <p className="text-xs text-slate-400">
                  {crop.crop} {crop.variety ? `(${crop.variety})` : ""}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure this crop has been harvested? This will advance the crop's lifecycle to <b>Harvested</b> and update your farm analytics.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmHarvest}
                disabled={harvestLoading}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
              >
                {harvestLoading ? "Updating..." : "Yes, Crop is Harvested"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
