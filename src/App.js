import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MatrixRain from "./components/MatrixRain";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Register from "./components/Register";
import Payment from "./components/Payment";
import Success from "./components/Success";

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-[#05090c] text-white overflow-hidden">

        {/* 🌌 GLOBAL BACKGROUND */}
        <MatrixRain />

        {/* FOREGROUND */}
        <div className="relative z-10 pt-16">
          <Navbar />

          <Routes>
            {/* VALID ROUTES */}
            <Route path="/" element={<Hero />} />
            <Route path="/register" element={<Register />} />
            <Route path="/payment" element={<Payment />} />
           <Route
  path="/success"
  element={
    localStorage.getItem("paymentDone") === "true"
      ? <Success />
      : <Navigate to="/" replace />
  }
/>


            {/* 🔥 CATCH ALL WRONG PATHS */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
