import { FaChartPie, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Cropcard from "./Cropcard";
import { fetchCrops } from "../../api/crop";

export default function ActiveCrops() {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    loadCrops();
  }, []);

  async function loadCrops() {
    try {
      const data = await fetchCrops();

      if (data.success) {
        setCrops(data.crops);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center text-white text-xl mb-4">
        <h1>Active Crops</h1>

        <button
          onClick={() => navigate("/add-crop")}
          className="bg-lime-600 p-2 rounded-lg hover:bg-green-700"
        >
          <FaPlus />
        </button>
      </div>

     

      <div className="space-y-4">
        {crops.map((crop) => (
          <Cropcard
            key={crop._id}
            crop={crop}
          />
        ))}
      </div>
    </div>
  );
}