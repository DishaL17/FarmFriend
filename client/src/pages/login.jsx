import { useState } from "react";
import Navbar from "../components/navbar/navbar";
export default function Login(){
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

 async function handleSubmit(event) {
  event.preventDefault();
   if (phone.length !== 10) {
    alert("Enter a valid 10-digit phone number");
    return;
  }
  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        password,
      }),
    });
    const data = await response.json();
   if (data.success) {
  localStorage.setItem("token", data.token);
  navigate("/dashboard");
} else {
    alert(data.message);
}
  } catch (error) {
   
  }
}

   return (
    <>
    <Navbar />
  <div className="min-h-screen flex items-center justify-center bg-green-50">
    <form onSubmit={handleSubmit}
    className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
    <h1 className="text-3xl font-bold text-center mb-6 text-green-700">Login</h1>

   <input
  type="tel"
  placeholder="Enter your phone number"
  value={phone}
   onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
  maxLength={10}
  className="w-full border rounded-lg p-3 mb-4"
/>

    <br />
    <br />

    <input
      type="password"
      placeholder="Enter your password"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
      className="w-full border rounded-lg p-3 mb-4"
    />

    <br />
    <br />

    <button type="submit"
     className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
      Login
    </button>
  </form>
  </div>
  </>
);
}