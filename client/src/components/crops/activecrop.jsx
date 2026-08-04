import { FaPlus , FaSeedling} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import Cropcard from "./Cropcard"; 
import { getCrops } from "../../api/crop";

export default function ActiveCrops() {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
function getDaysSinceSowing(date) {
  const sowedDate = new Date(date);
  const today = new Date();

  sowedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return Math.max(
    0,
    Math.floor((today - sowedDate) / (1000 * 60 * 60 * 24))
  );
}

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
      <div className="flex-1 space-y-5 pr-2 overflow-y-auto">
  {crops.map((crop) => (
    <div
      key={crop.id}
      className="bg-white rounded-xl p-4 shadow"
    >
      <div className="flex justify-between">
       <div className="flex items-center gap-1 "> 
        <FaSeedling className="text-green-700"/>
        <h2 className="text-lg font-bold">{crop.crop}</h2></div>
         <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 text-[10px] px-2 py-0.5 rounded-full font-bold">
            Day {getDaysSinceSowing(crop.date)}
          </span>
      </div>

      <div className="flex justify-between"><p>Area: {crop.area}</p>
      <p>Sowed: {crop.date}</p></div>

      
    </div>
  ))}
</div>
    </div>
  );
}