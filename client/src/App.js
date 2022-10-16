import React from "react";
import Home from "./pages/Home";
import Reserve from "./pages/Reserve";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
const title = "Navigation Bar";

function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="reserve" element={<Reserve />} />
      </Routes>
    </div>
  );
}

export default App;
