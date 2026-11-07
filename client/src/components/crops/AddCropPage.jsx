import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import {
  FaArrowLeft,
  FaSeedling,
  FaRulerCombined,
  FaCalendarAlt,
  FaMountain,
  FaLeaf,
  FaWater,
} from "react-icons/fa";

export default function AddCropPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    crop: "",
    area: "",
    date: "",
    soil_type: "",
    variety: "",
    irrigation_type: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/crops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add crop");
      }

      alert(data.message);
      navigate("/crops");
    } catch (error) {
      console.error("Add Crop Error:", error);
      alert(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100";

  const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-screen bg-lime-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-700 cursor-pointer"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="mb-8">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl text-green-700">
            <FaSeedling />
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Add New Crop
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add your crop details to get personalized farming insights and AI-powered crop care suggestions.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSave}
          className="space-y-7 rounded-3xl border border-green-100 bg-white p-6 shadow-sm md:p-8"
        >
          {/* Basic Information */}
          <div>
            <h2 className="mb-5 text-lg font-bold text-gray-800">
              Basic Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Crop Name *</label>
                <div className="relative">
                  <FaSeedling className="absolute left-4 top-4 text-green-600" />
                  <input
                    name="crop"
                    value={formData.crop}
                    onChange={handleChange}
                    placeholder="e.g. Wheat, Rice, Soybean"
                    className={`${inputClass} pl-11`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Crop Variety</label>
                <div className="relative">
                  <FaLeaf className="absolute left-4 top-4 text-green-600" />
                  <input
                    name="variety"
                    value={formData.variety}
                    onChange={handleChange}
                    placeholder="e.g. Sharbati, JS-335"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Cultivated Area *</label>
                <div className="relative">
                  <FaRulerCombined className="absolute left-4 top-4 text-green-600" />
                  <input
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. 5 acres"
                    className={`${inputClass} pl-11`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Sowing Date *</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-4 text-green-600" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`${inputClass} pl-11`}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Growing Conditions */}
          <div>
            <h2 className="mb-5 text-lg font-bold text-gray-800">
              Growing Conditions
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Soil Type *</label>
                <div className="relative">
                  <FaMountain className="absolute left-4 top-4 text-green-600" />
                  <select
                    name="soil_type"
                    value={formData.soil_type}
                    onChange={handleChange}
                    className={`${inputClass} pl-11`}
                    required
                  >
                    <option value="">Select soil type</option>
                    <option value="Black">Black Soil</option>
                    <option value="Clay">Clay Soil</option>
                    <option value="Sandy">Sandy Soil</option>
                    <option value="Loamy">Loamy Soil</option>
                    <option value="Alluvial">Alluvial Soil</option>
                    <option value="Red">Red Soil</option>
                    <option value="Other">Other / Not Sure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Irrigation Method *</label>
                <div className="relative">
                  <FaWater className="absolute left-4 top-4 text-green-600" />
                  <select
                    name="irrigation_type"
                    value={formData.irrigation_type}
                    onChange={handleChange}
                    className={`${inputClass} pl-11`}
                    required
                  >
                    <option value="">Select irrigation method</option>
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Canal">Canal</option>
                    <option value="Borewell">Borewell / Tube Well</option>
                    <option value="Rainfed">Rainfed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-green-700 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Saving Crop..." : "Save Crop"}
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-xs text-gray-400">
          Your crop information will help generate more relevant farming recommendations.
        </p>
      </div>
    </div>
  );
}
