import { Routes, Route } from "react-router-dom";
import Home  from "./pages/home/home";
import Login from "./pages/home/login";
import Register from "./pages/home/register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;