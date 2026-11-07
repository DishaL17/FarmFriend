import { useState, useEffect } from "react";
import { FaMoneyBillWave, FaPlus } from "react-icons/fa";
import { API_BASE_URL } from "../../config/api";

const labelClass =
  "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";

const fieldClass =
  "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm sm:text-base focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-700 bg-slate-50 focus:bg-white";

export default function TransactionModal({ onClose, onSuccess }) {
  const [crops, setCrops] = useState([]);
  const [crop, setCrop] = useState("General");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");

  useEffect(() => {
    async function loadCrops() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/crops`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.crops)) {
          setCrops(data.crops);
        }
      } catch (err) {
        console.error("Failed to load crops for transactions:", err);
      }
    }
    loadCrops();
  }, []);

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          crop,
          name,
          amount: Number(amount),
          type,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      alert(data.message);
      setCrop("General");
      setName("");
      setAmount("");
      setType("Expense");

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  }

  const isModal = typeof onClose === "function";

  const header = (
    <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
      <span className="bg-emerald-100 p-2 rounded-lg text-emerald-700 flex items-center justify-center shrink-0">
        <FaMoneyBillWave />
      </span>
      Add Transaction
    </h2>
  );

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Associate with Crop</label>
        <select
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className={fieldClass}
        >
          <option value="General">General (None)</option>
          {crops.map((c) => (
            <option key={c.id} value={c.crop}>
              {c.crop}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Transaction Name</label>
        <input
          type="text"
          placeholder="e.g., Fertilizer, Seeds, Sale"
          className={fieldClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Amount + Type side by side on wider screens to shorten the form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Amount (₹)</label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder="Enter amount"
            className={fieldClass}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Type</label>
          <select
            className={fieldClass}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Date: <b className="text-slate-600 font-medium">{currentDate}</b>
      </p>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
        {isModal && (
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <FaPlus className="text-xs" />
          Save
        </button>
      </div>
    </form>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {header}
          {formContent}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 border border-slate-100 w-full">
      {header}
      {formContent}
    </div>
  );
}