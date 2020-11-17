import React, { useState, useEffect } from "react";
import openSocket from "socket.io-client";

import HomePage from "../Interface/Home";
import Scan from "../../components/Scan/Scan";

function Login(props) {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const usenameChangeHandler = (event) => {
    setUsername(event.target.value);
  };
  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const tokenHandler = (data) => {
    setToken(data);
    props.activeSttaus();
  };

  const submitClickHandler = async () => {
    // setToken("acbjsdhvcbjsdbvsd");
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
      // auth.login(responseData.userId, responseData.token);
      setToken(responseData.token);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const socket = openSocket("http://localhost:5000", {
      transports: ["websocket"],
    });
    const pathName = window.location.pathname;
    const kioskId = pathName.split("/")[1];

    socket.emit("joinAuthRoom", kioskId);

    socket.on("jwttoken", (data) => {
      // if (!token) {
      //   setToken(data);
      // }
      setToken(data);
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
      <label for="username">Username: </label>
      <input
        id="username"
        value={username}
        onChange={(event) => usenameChangeHandler(event)}
      />
      <p />
      <label for="password">Password: </label>
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
    </div>
  );

  return (
    <div>
      {token ? (
        <HomePage kioskInfo={props.kioskInfo} tokenHandler={tokenHandler} />
      ) : (
        LoginPage
      )}
    </div>
  );
}

export default Login;
