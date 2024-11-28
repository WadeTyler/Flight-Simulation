
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import FlightSimulation from "./pages/FlightSimulation";

import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulation" element={<FlightSimulation />} />
      </Routes>
    </>
  )
}