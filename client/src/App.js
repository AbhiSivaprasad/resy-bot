import React, { useState } from "react";
import Home from "./pages/Home";
import Reserve from "./pages/Reserve";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import Nav from "./components/Nav";
import Signin from "./pages/Signin";
import { useEffect } from "react";
import MyReservations from "./pages/MyReservations";
import { DateTimePicker } from "react-widgets";
import DetailedTimePicker from "./components/DetailedTimePicker";
import Admin from "./pages/Admin";
const title = "Navigation Bar";
export const UserContext = React.createContext("");
function App() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("username")) {
      fetch(
        process.env.REACT_APP_SERVER_URL +
          "/user?user_id=" +
          localStorage.getItem("username")
      )
        .then((res) => {
          if (res.ok) return res.json();
          else {
            localStorage.removeItem("username");
            throw new Error("Status code error :" + res.status);
          }
        })
        .then((data) => {
          console.log("data is", data);
          setUser({ ...user, data });
          if (!data.keys?.apiKey || !data.keys?.authToken) {
            navigate("/signin");
          } else if (window.location.pathname == "/") {
            navigate("/reservations");
          }
        });
    } else {
      //navigate("/");
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
        <Route path="swan" element={<Admin />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
