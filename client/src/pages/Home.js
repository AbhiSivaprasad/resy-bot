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
          !data?.keys?.apiKey ||
          !data?.keys?.authToken ||
          data?.keys?.apiKey.length < 10 ||
          data?.keys?.authToken.length < 50
        ) {
          navigate("/signin");
        } else {
          navigate("/reservations");
        }
      })
      .catch((err) => setUsernameError("User does not exist"));
  };
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="container flex flex-col justify-center h-[calc(100vh-10rem)]">
          <div className="h-96 flex flex-col items-center justify-center">
            <div className="text-center text-4xl mb-4">
              Welcome to Resy Bot.
            </div>
            <div>Enter your username below.</div>
            <Input
              className="w-64 my-2"
              onChange={setUsername}
              onEnter={attemptSignIn}
              autoFocus
            ></Input>
            {usernameError && (
              <div className="text-white p-2 bg-red-300 m-2">
                {usernameError}
              </div>
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
      <div className="fixed bottom-4 flex flex-row justify-center w-full">
        <div className="text-gray-500 font-light text-center mt-2 mb-4">
          Abhi Sivaprasad and Shaya Zarkesh
        </div>
      </div>
    </>
  );
}

export default Home;
