import React, { useState } from "react";
import Home from "./pages/Home";
import Reserve from "./pages/Reserve";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Signin from "./pages/Signin";
import { useEffect } from "react";
import MyReservations from "./pages/MyReservations";
const title = "Navigation Bar";
export const UserContext = React.createContext("");
function App() {
  const [user, setUser] = useState({});
  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        if (location) {
          setUser({ ...user, location });
        }
      });
    }
  }, []);
  return (
    <UserContext.Provider value={[user, setUser]}>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="reserve" element={<Reserve />} />
        <Route path="reservations" element={<MyReservations />} />
        <Route path="signin" element={<Signin />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
