import { useState } from "react";
import Navbar from "../components/navbar/navbar";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
 const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
     if (phone.length !== 10) {
    alert("Enter a valid 10-digit phone number");
    return;
  }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
  phone,
  password,
  
}),
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        navigate("/login")
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  return (
    <>
  <Navbar />

  <div className="min-h-screen flex items-center justify-center bg-green-50">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
    >
      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
        Register
      </h1>
<input
        type="name"
        placeholder="Enter your Name"
        className="w-full border rounded-lg p-3 mb-6"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

     <input
  type="tel"
  placeholder="Enter your phone number"
  value={phone}
  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
  maxLength={10}
  className="w-full border rounded-lg p-3 mb-4"
/>

      <input
        type="password"
        placeholder="Enter your password"
        className="w-full border rounded-lg p-3 mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
      >
        Register
      </button>
    </form>
  </div>
</>
  );
}