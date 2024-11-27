
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import FlightSimulation from "./pages/FlightSimulation";

export default function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/simulation" element={<FlightSimulation />} />
    </Routes>

  )
}