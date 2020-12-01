import React, { useState, useEffect, useRef, useContext } from "react";

import { AuthContext } from "../../context/auth-context";
import { getSocket } from "../../util/socket";

import HomePage from "../Interface/Home";
// import Scan from "../../components/Scan/Scan";
import EnterPin from "../../components/Pin/EnterPin";
import SetupPin from "../../components/Pin/SetupPin";
import LoginForm from "../../components/Login/LoginForm";
import Scan from "../../components/Scan/Scan";

function Login(props) {
  const _KIOSK_ID = localStorage.getItem("kioskId");
  const auth = useContext(AuthContext);
  const [setupPin, setSetupPin] = useState(false);
  const [displayPin, setdisplayPin] = useState(false);

  const tokenHandler = (data) => {
    // console.log(data);
    if (Object.keys(data).length === 0) {
      auth.logout();
      props.activeStataus();
    } else {
      if (!auth.isLoggedIn) {
        auth.login(data.token);
        setdisplayPin(false);
      }
    }
  };

  const submitClickHandler = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        alert("Invalid Login");
        throw new Error(responseData.message);
      }
      // console.log(responseData);

      if (responseData.setupPin) {
        auth.login(responseData.token);
        setSetupPin(true);
      } else {
        auth.login(responseData.token);
      }
      username = "";
      password = "";
    } catch (err) {
      console.log(err);
    }
  };

  const fetchedUser = useRef();

  useEffect(() => {
    const socket = getSocket();

    socket.emit("joinAuthRoom", _KIOSK_ID);

    socket.on("jwttoken", (data) => {
      fetchedUser.current = data.userId;
      console.log(data);
      if (data.displayPin) setdisplayPin(true);
      else if (data.setupPin) {
        window.alert("Please login to set up your pin");
        setSetupPin(true);
      }
    });

    socket.on("disconnect", () => {
      console.log("Application server disconnected!");
      socket.on("connect", () => {
        socket.emit("joinAuthRoom", _KIOSK_ID);
        console.log("Application server connected back!");
      });
    });

    // return () => socket.off("jwttoken");
  }, [_KIOSK_ID]);

  return (
    <div>
      {auth.isLoggedIn && setupPin ? (
        <SetupPin handleSubmit={setSetupPin} />
      ) : setupPin ? (
        <div>
          <LoginForm handleLogin={submitClickHandler} />
          <a href={`/${_KIOSK_ID}`}>Go Back</a>
        </div>
      ) : displayPin ? (
        <EnterPin userId={fetchedUser.current} tokenHandler={tokenHandler} />
      ) : auth.isLoggedIn && !setupPin ? (
        <HomePage tokenHandler={tokenHandler} />
      ) : (
        <div>
          <Scan name="ID Card" hideButton="true" />
          <p>OR</p>
          <div>
            <LoginForm handleLogin={submitClickHandler} />
            <a href={`/${_KIOSK_ID}`}>Go Back</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
