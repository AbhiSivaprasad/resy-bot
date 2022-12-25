import React, { useContext, useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { UserContext } from "../App";

function Step(props) {
  return (
    <div className="flex flex-row items-center lg:text-lg my-2 space-x-4">
      <div className="grow-0 shrink-0 bg-red-500 text-xl rounded-full basis-10 h-10 border-10 flex justify-center items-center text-white">
        {props.num}
      </div>
      <div>{props.children}</div>
    </div>
  );
}
function Signin() {
  const [user, setUser] = useContext(UserContext);

  let navigate = useNavigate();
  let [apiKey, setApiKey] = useState("");
  let [authToken, setAuthToken] = useState("");
  let postUser = () => {
    console.log("user id is", user.data.user_id);
    fetch(process.env.REACT_APP_SERVER_URL + "/user", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        user_id: user.data.user_id,
        api_key: apiKey,
        auth_token: authToken,
      }),
    })
      .then((res) => res.text())
      .then((res) => {
        if (res == "Update successful") {
          fetch(
            process.env.REACT_APP_SERVER_URL +
              "/user?user_id=" +
              user.data.user_id
          )
            .then((res) => {
              if (res.ok) return res.json();
              else throw new Error("Status code error :" + res.status);
            })
            .then((data) => {
              setUser({ ...user, data });
              localStorage.setItem("username", user.data.user);
              navigate("/reservations");
            });
          navigate("/reservations");
        }
      });
  };
  return (
    <div className="flex flex-col items-center">
      <div className="container max-w-4xl flex flex-col items-center px-8">
        <div className="text-2xl my-4 text-center">
          Just some setup for the first time.
        </div>
        <div>
          <Step num={1}>
            Go to{" "}
            <a className="a" target={"_blank"} href="https://resy.com">
              https://resy.com
            </a>{" "}
            and make sure you're signed in.
          </Step>
          <Step num={2}>
            Right click, click "Inspect", and go to the "network" tab.
          </Step>
          <Step num={3}>Refresh the page.</Step>
          <Step num={4}>
            Type in "user" in the filter text box, and click on any of the
            requests with name "user".
          </Step>
          <Step num={5}>
            You should see{" "}
            <code>"Request Url: https://api.resy.com/2/user"</code> and{" "}
            <code>"Request Method: GET"</code>. Scroll down to authorization
            (under Request Headers), and copy the text after api_key=
          </Step>
          <Input
            className="my-1 pl-12"
            onChange={setApiKey}
            placeholder="Your api key..."
          ></Input>
          <Step num={6}>
            Scroll down to the field titled <code>x-resy-auth-token</code> and
            paste the contents below (this should be a longer string!)
          </Step>
          <Input
            className="my-1 pl-12"
            onChange={setAuthToken}
            placeholder="Your auth token..."
          ></Input>
        </div>
        <div className="w-72">
          <Button
            onClick={() => postUser()}
            disabled={!apiKey || !authToken}
            className="w-full my-1"
          >
            Let's go
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Signin;
