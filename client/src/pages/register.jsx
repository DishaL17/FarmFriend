import { useEffect, useState } from "react";
import Navbar from "../components/navbar/navbar";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [location, setLocation] = useState("");

  const [districts, setDistricts] = useState([]);
const [villages, setVillages] = useState([]);
const [selectedDistrictId, setSelectedDistrictId] = useState("");

useEffect(() => {
  fetchDistricts();
}, []);

async function fetchDistricts() {
  try {
    const response = await fetch(
      "http://localhost:5000/api/location/districts"
    );

    const data = await response.json();
    setDistricts(data);
  } catch (error) {
    console.log(error);
  }
}
async function fetchVillages(districtId) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/location/villages/${districtId}`
    );

    const data = await response.json();
    setVillages(data);
  } catch (error) {
    console.log(error);
  }
}
  async function handleSubmit(event) {
    event.preventDefault();
    if (phone.length !== 10) {
      alert("Enter a valid 10-digit phone number");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          password,
          location,
          district,
          state,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }
 console.log(districts);
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-green-700">Register</h1>
          <input
            type="text"
            placeholder="Enter your Name"
            className="w-full border rounded-lg p-3 mb-6"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            maxLength={10}
            className="w-full border rounded-lg p-3 mb-4"
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border rounded-lg p-3 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Madhya Pradesh"
            className="w-full border rounded-lg p-3 mb-6"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
          <select
  className="w-full border rounded-lg p-3 mb-6"
  value={selectedDistrictId}
  onChange={(e) => {
    const id = e.target.value;

   setSelectedDistrictId(id);

const selected = districts.find(
  (district) => district.id === Number(id)
);

setDistrict(selected ? selected.name : "");

// Clear previous village
setLocation("");

// Load villages of selected district
fetchVillages(id);
  }}
  required
>
  <option value="">Select District</option>

  {districts.map((district) => (
    <option key={district.id} value={district.id}>
      {district.name}
    </option>
  ))}
</select>

          <select
  className="w-full border rounded-lg p-3 mb-6"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  required
>
  <option value="">Select Village</option>

  {villages.map((village) => (
    <option key={village.id} value={village.name}>
      {village.name}
    </option>
  ))}
</select>

          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
            Register
          </button>
        </form>
      </div>
    </>
  );
}