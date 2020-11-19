import React, { useState, useEffect } from "react";

import LoginPage from "../Auth/Login";

function Start() {
  const [active, setActive] = useState(false);
  const [kiosk, setkiosk] = useState();

  const clickHandler = () => {
    try {
      if (!kiosk) throw new Error("Kiosk not found! or Server not connected!");
      else setActive(true);
    } catch (err) {
      console.log(err);
    }
    // console.log("Kiosk id: ", kiosk.id);
  };

  const toggleActive = () => {
    setActive(!active);
  };

  useEffect(() => {
    const pathName = window.location.pathname;
    const kioskId = pathName.split("/")[1];
    // console.log(kioskId);

    async function helper() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/kiosks/${kioskId}`,
          {
            method: "GET",
          }
        );
        const kiosk = await response.json();
        // console.log(kiosk);
        setkiosk(kiosk);
      } catch (err) {
        console.log(err);
      }
    }

    helper();
  }, []);

  const StartPage = <button onClick={clickHandler}>Click to start</button>;

  return (
    <>
      {active ? (
        <LoginPage kioskInfo={kiosk} activeStataus={toggleActive} />
      ) : (
        StartPage
      )}
    </>
  );
}

export default Start;
