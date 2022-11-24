import React, { useState } from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="container">
        <div className="h-96 flex flex-col items-center justify-center">
          <div className="text-center text-4xl">Welcome to resy bot.</div>
          <div className="text-2xl font-thin text-center mt-2 mb-4">
            A project by Abhi Sivaprasad and Shaya Zarkesh
          </div>
          <Button color="red">
            <Link to="reserve">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
