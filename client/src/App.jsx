import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Weather from "./pages/weather";
import AddCropPage from "./components/crops/AddCropPage";   
import Crops from "./pages/crops";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/add-crop" element={<AddCropPage />} />
      <Route path="/crops" element={<Crops />} />
    </Routes>
  );
}

export default App;