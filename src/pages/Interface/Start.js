import React, { useState, useContext } from "react";

import LoginPage from "../Auth/Login";
import { AuthContext } from "../../context/auth-context";

function Start() {
  const pathName = window.location.pathname;

  if (localStorage.getItem("kioskId") !== pathName.split("/")[1]) {
    localStorage.setItem("kioskId", pathName.split("/")[1]);
  }

  const _KIOSK_ID = localStorage.getItem("kioskId");

  const auth = useContext(AuthContext);
  const axios = auth.getAxiosInstance;

  const [active, setActive] = useState(false);

  const clickHandler = async () => {
    try {
      await axios.get(`/api/kiosks/${_KIOSK_ID}`);

      setActive(true);
    } catch (err) {
      window.alert(err.response.data.error.message);
    }
  };

  const StartPage = <button onClick={clickHandler}>Click to start</button>;

  return <>{active || auth.isLoggedIn ? <LoginPage /> : StartPage}</>;
}

export default Start;
