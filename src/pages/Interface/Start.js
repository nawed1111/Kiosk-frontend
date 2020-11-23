import React, { useState } from "react";

import LoginPage from "../Auth/Login";

const pathName = window.location.pathname;
const kioskId = pathName.split("/")[1];

function Start() {
  const [active, setActive] = useState(false);

  const clickHandler = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/kiosks/${kioskId}`,
        {
          method: "GET",
        }
      );
      const responseData = await response.json();
      if (!responseData.kioskId)
        throw new Error("Kiosk not found! or Server not connected!");
      else setActive(true);
    } catch (err) {
      console.log(err);
    }
    // console.log("Kiosk id: ", kiosk.id);
  };

  const toggleActive = () => {
    setActive(!active);
  };

  const StartPage = <button onClick={clickHandler}>Click to start</button>;

  return (
    <>
      {active ? (
        <LoginPage kioskId={kioskId} activeStataus={toggleActive} />
      ) : (
        StartPage
      )}
    </>
  );
}

export default Start;
