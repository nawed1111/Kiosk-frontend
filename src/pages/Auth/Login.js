import React, { useState, useEffect, useRef, useContext } from "react";

import { AuthContext } from "../../context/auth-context";
import { getSocket } from "../../util/socket";

import HomePage from "../Interface/Home";
import EnterPin from "../../components/Pin/EnterPin";
import SetupPin from "../../components/Pin/SetupPin";
import Scan from "../../components/Scan/Scan";

import { Icon, Grid, Header } from "semantic-ui-react";

function Login() {
  const _KIOSK_ID = localStorage.getItem("kioskId");
  const auth = useContext(AuthContext);
  const [setupPin, setSetupPin] = useState(false);
  const [displayPin, setdisplayPin] = useState(false);

  const tokenHandler = (data) => {
    if (!auth.isLoggedIn) {
      auth.login(data.accessToken, data.refreshToken);
      setdisplayPin(false);
    }
  };
  /*
  const submitClickHandler = async (username, password) => {
    try {
      const response = await fetch("/api/auth/login", {
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
        auth.login(responseData.accessToken, responseData.refreshToken);
        setSetupPin(true);
      } else {
        auth.login(responseData.accessToken, responseData.refreshToken);
      }

      username = "";
      password = "";
    } catch (err) {
      console.log(err);
    }
  };
*/
  const fetchedUser = useRef();

  useEffect(() => {
    const socket = getSocket();

    // socket.emit("joinAuthRoom", _KIOSK_ID);

    socket.on("jwttoken", (data) => {
      fetchedUser.current = data.userid;

      if (data.displayPin) setdisplayPin(true);
      else if (data.setupPin) {
        setSetupPin(true);
      }
    });

    socket.on("disconnect", () => {
      console.log("Application server disconnected!");
      socket.off("joinAuthRoom");
      // socket.on("connect", () => {
      //   socket.emit("joinAuthRoom", _KIOSK_ID);
      //   console.log("Application server connected back!");
      // });
    });

    socket.on("connect", () => {
      socket.emit("joinAuthRoom", _KIOSK_ID);
      console.log("Application server connected!");
    });

    return () => socket.off("joinAuthRoom");
  }, [_KIOSK_ID]);

  const loginPage = (
    <Grid padded centered>
      <Grid.Row>
        <Header inverted style={{ fontFamily: "Roboto", fontSize: "40px" }}>
          {_KIOSK_ID.toUpperCase()}
        </Header>
      </Grid.Row>
      <Grid.Row>
        <Scan name="BADGE CARD" hideButton="true" />
      </Grid.Row>
      <Grid.Row>
        <Icon
          name="arrow alternate circle left outline"
          size="huge"
          link
          inverted
          onClick={() => window.location.reload()}
        />
      </Grid.Row>
    </Grid>
  );

  return (
    <div>
      {auth.isLoggedIn ? (
        <HomePage />
      ) : setupPin ? (
        <SetupPin
          userid={fetchedUser.current}
          tokenHandler={tokenHandler}
          setupPin={() => setSetupPin(false)}
        />
      ) : displayPin ? (
        <EnterPin
          userid={fetchedUser.current}
          tokenHandler={tokenHandler}
          onCancel={() => setdisplayPin(false)}
        />
      ) : (
        loginPage
      )}
    </div>
  );
}

export default Login;
