import React from "react";

import { useHistory } from "react-router-dom";
import RegisterForm from "../RegisterForm/RegisterForm";
import Nav from "../Nav/Nav.jsx";

function RegisterPage() {
  const history = useHistory();

  return (
    <div>
      <Nav />
      <RegisterForm />

      <center>
        <button
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            history.push("/login");
          }}
        >
          Login
        </button>
      </center>
    </div>
  );
}

export default RegisterPage;
