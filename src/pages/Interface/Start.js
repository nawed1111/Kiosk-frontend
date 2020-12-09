import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import LoginPage from "../Auth/Login";
import Loading from "../../components/Loader/Loading";

import { AuthContext } from "../../context/auth-context";
import { Image, Grid } from "semantic-ui-react";

import touchImage from "../../assets/images/start.png";
import touchtoStart from "../../assets/images/touch-to-start.png";

function Start() {
  const pathName = window.location.pathname;

  if (localStorage.getItem("kioskId") !== pathName.split("/")[1]) {
    localStorage.setItem("kioskId", pathName.split("/")[1]);
  }

  const _KIOSK_ID = localStorage.getItem("kioskId");

  const auth = useContext(AuthContext);
  const axios = auth.getAxiosInstance;

  const [active, setActive] = useState(false);
  const [loading, setloading] = useState(false);

  const clickHandler = async () => {
    setloading(true);
    try {
      await axios.get(`/api/kiosks/${_KIOSK_ID}`);

      setloading(false);
      setActive(true);
    } catch (err) {
      setloading(false);
      window.alert("Possible error- server disconnected. Contact admin");
    }
  };

  const StartPage = (
    <Grid style={{ height: "550px" }} verticalAlign="middle">
      <Grid.Row textAlign="center">
        <Grid.Column>
          <Link to={`/${_KIOSK_ID}`} onClick={clickHandler}>
            <Image src={touchImage} size="medium" circular centered />
          </Link>
          <p />
          <Image src={touchtoStart} centered />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );

  return (
    <>
      {loading ? (
        <Loading message="Loading..." />
      ) : active || auth.isLoggedIn ? (
        <LoginPage />
      ) : (
        StartPage
      )}
    </>
  );
}

export default Start;
