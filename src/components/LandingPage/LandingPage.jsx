import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./LandingPage.css";

// CUSTOM COMPONENTS
import RegisterForm from "../RegisterForm/RegisterForm";
import Nav from "../Nav/Nav";

function LandingPage() {
  const [heading, setHeading] = useState("Welcome");
  const history = useHistory();

  const onLogin = (event) => {
    history.push("/login");
  };

  return (
    <div>
      <Nav />
      <div className="container">
        <h2>{heading}</h2>

        <div className="grid">
          <div className="grid-col grid-col_8">
            <p>-</p>
          </div>
          <div className="grid-col grid-col_4">
            <RegisterForm />

            <center>
              <h4>Already a Member?</h4>
              <button className="btn btn_sizeSm" onClick={onLogin}>
                Login
              </button>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
