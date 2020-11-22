import React, { useState, useEffect, useRef, useContext } from "react";
import openSocket from "socket.io-client";

import { AuthContext } from "../../context/auth-context";

import HomePage from "../Interface/Home";
import Scan from "../../components/Scan/Scan";
import EnterPin from "../../components/Pin/EnterPin";

function Login(props) {
  const auth = useContext(AuthContext);
  const [displayPin, setdisplayPin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const usenameChangeHandler = (event) => {
    setUsername(event.target.value);
  };
  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const tokenHandler = (data) => {
    // console.log(data);
    if (Object.keys(data).length === 0) {
      auth.logout();
      props.activeStataus();
    } else {
      if (!auth.isLoggedIn) {
        auth.login(data.user, data.token);
        setdisplayPin(false);
      }
    }
  };

  const submitClickHandler = async () => {
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
      auth.login(responseData.user, responseData.token);
      // setToken(responseData.token);
      if (response.ok) {
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchedUser = useRef();

  useEffect(() => {
    const socket = openSocket("http://localhost:5000", {
      transports: ["websocket"],
    });
    const pathName = window.location.pathname;
    const kioskId = pathName.split("/")[1];

    socket.emit("joinAuthRoom", kioskId);

    socket.on("jwttoken", (data) => {
      fetchedUser.current = data.user;
      setdisplayPin(true);
    });

    socket.on("disconnect", () => {
      console.log("Application server disconnected!");
      socket.on("connect", () => {
        socket.emit("joinAuthRoom", kioskId);
        console.log("Application server connected back!");
      });
    });
  }, []);

  const LoginPage = (
    <div>
      <Scan name="ID Card" hideButton="true" />
      <p>OR</p>
      <h2>Login with your crdentials</h2>
      <label htmlFor="username">Username: </label>
      <input
        id="username"
        value={username}
        onChange={(event) => usenameChangeHandler(event)}
      />
      <p />
      <label htmlFor="password">Password: </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => passwordChangeHandler(event)}
      />
      <p />
      <button onClick={submitClickHandler} disabled={!username || !password}>
        Login
      </button>

      <a href={`/${props.kioskId}`}>Go Back</a>
    </div>
  );

  return (
    <div>
      {displayPin ? (
        <EnterPin user={fetchedUser.current} tokenHandler={tokenHandler} />
      ) : auth.isLoggedIn ? (
        <HomePage kioskId={props.kioskId} tokenHandler={tokenHandler} />
      ) : (
        LoginPage
      )}
    </div>
  );
}

export default Login;
