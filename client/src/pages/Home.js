import React, { useContext, useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { UserContext } from "../App";

function Home() {
  let navigate = useNavigate();
  let [username, setUsername] = useState("");
  let [usernameError, setUsernameError] = useState("");
  const [user, setUser] = useContext(UserContext);
  let attemptSignIn = () => {
    console.log("attempting signin");
    setUsernameError("");

    fetch(process.env.REACT_APP_SERVER_URL + "/user?user_id=" + username)
      .then((res) => {
        if (res.ok) return res.json();
        else throw new Error("Status code error :" + res.status);
      })
      .then((data) => {
        setUser({ ...user, data });
        localStorage.setItem("username", username);
        // likely haven't set this correctly
        if (
          !data.api_key ||
          !data.auth_token ||
          data.api_key.length < 10 ||
          data.auth_token.length < 50
        ) {
          navigate("/signin");
        } else {
          navigate("/reservations");
        }
      })
      .catch((err) => setUsernameError("User does not exist"));
  };
  return (
    <div className="flex flex-col items-center">
      <div className="container">
        <div className="h-96 flex flex-col items-center justify-center">
          <div className="text-center text-4xl">Welcome to resy bot.</div>
          <div className="text-2xl font-thin text-center mt-2 mb-4">
            A project by Abhi Sivaprasad and Shaya Zarkesh
          </div>
          <div>Enter your username below...</div>
          <Input className="w-64 my-2" onChange={setUsername}></Input>
          {usernameError && (
            <div className="text-white p-2 bg-red-300 m-2">{usernameError}</div>
          )}
          <Button
            disabled={!username}
            onClick={attemptSignIn}
            color="red"
            className="w-48 my-2"
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
