import React, { useState, useContext } from "react";

import LoginPage from "../Auth/Login";
import { AuthContext } from "../../context/auth-context";

const pathName = window.location.pathname;

if (localStorage.getItem("kioskId") !== pathName.split("/")[1]) {
  localStorage.setItem("kioskId", pathName.split("/")[1]);
}

const _KIOSK_ID = localStorage.getItem("kioskId");

function Start() {
  const auth = useContext(AuthContext);
  const [active, setActive] = useState(false);

  const clickHandler = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/kiosks/${_KIOSK_ID}`,
        {
          method: "GET",
        }
      );
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message);
      else setActive(true);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleActive = () => {
    setActive(!active);
  };

  const StartPage = <button onClick={clickHandler}>Click to start</button>;

  return (
    <>
      {active || auth.isLoggedIn ? (
        <LoginPage activeStataus={toggleActive} />
      ) : (
        StartPage
      )}
    </>
  );
}

export default Start;
