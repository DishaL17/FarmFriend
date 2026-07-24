import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import Cropcard from "./Cropcard"; 
import { getCrops } from "../../api/crop";

export default function ActiveCrops() {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    loadCrops();
  }, []);

async function loadCrops() {
  try {
    const data = await getCrops();

    if (data.success) {
      setCrops(data.crops);
    }
  } catch (err) {
    console.error(err);
  }
}

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center text-white text-xl mb-5 flex-shrink-0">
        <h1>Active Crops</h1>

        <button
          onClick={() => navigate("/add-crop")}
          className="bg-lime-600 p-2 rounded-lg hover:bg-green-700"
        >
          <FaPlus />
        </button>
      </div>

      {/* Crop List */}
      <div className="flex-1 space-y-5 pr-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-white/10">
        {crops.map((crop) => (
          <Cropcard key={crop.id} crop={crop} />
        ))}
      </div>
    </div>
  );
}