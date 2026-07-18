import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddCropPage() {
  const navigate = useNavigate();
  const [crop, setCrop] = useState("");
  const [area, setArea] = useState("");
  const [date, setDate] = useState("");

  async function handleSave(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/addcrop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crop,
          area,
          date,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      alert(data.message);

      // Optional: clear the form
      setCrop("");
      setArea("");
      setDate("");

    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  }

  return (
    <form onSubmit={handleSave}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Add Crop</h1>
       <button
  type="button"
  onClick={() => navigate("/dashboard")}
  className="fixed top-6 right-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg"
>
  Back
</button>

        <input
          type="text"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          placeholder="Crop Name"
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Area"
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}