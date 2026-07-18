import { useState, useEffect } from "react";
import { FaMoneyBillWave, FaPlus } from "react-icons/fa";

export default function TransactionModal({ onClose, onSuccess }) {
  const [crops, setCrops] = useState([]);
  const [crop, setCrop] = useState("General");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");

  useEffect(() => {
    async function loadCrops() {
      try {
        const res = await fetch("http://localhost:5000/crops");
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
      const response = await fetch("http://localhost:5000/addtransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Associate with Crop
        </label>
        <select
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-700 bg-slate-50 focus:bg-white"
        >
          <option value="General">General (None)</option>
          {crops.map((c) => (
            <option key={c._id} value={c.crop}>
              {c.crop}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Transaction Name
        </label>
        <input
          type="text"
          placeholder="e.g., Fertilizer, Seeds, Sale"
          className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-700 bg-slate-50 focus:bg-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Amount (₹)
        </label>
        <input
          type="number"
          placeholder="Enter amount"
          className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-700 bg-slate-50 focus:bg-white"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Type
        </label>
        <select
          className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-700 bg-slate-50 focus:bg-white"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-400">
          Date: <b className="text-slate-600 font-medium">{currentDate}</b>
        </p>

        <div className="flex gap-2">
          {isModal && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
          >
            <FaPlus className="text-xs" />
            Save
          </button>
        </div>
      </div>
    </form>
  );


  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-96 p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
              <FaMoneyBillWave />
            </span>
            Add Transaction
          </h2>
          {formContent}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
          <FaMoneyBillWave />
        </span>
        Add Transaction
      </h2>
      {formContent}
    </div>
  );
}