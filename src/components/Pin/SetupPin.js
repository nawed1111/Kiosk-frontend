import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import { Grid, Image, Header } from "semantic-ui-react";
import Numpad from "./Numpad";

import Loading from "../../components/Loader/Loading";
import signSuccessfullImage from "../../assets/images/sign-successfull.png";

function SetupPin(props) {
  const auth = useContext(AuthContext);
  const axios = auth.getAxiosInstance;
  const [pin, setPin] = useState("");
  const [status, setstatus] = useState({
    loading: false,
    signed: false,
  });

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const submitClickHandler = async (value) => {
    if (pin !== value) return window.alert("Pin do not match");

    setstatus({ ...status, loading: true });

    try {
      const response = await axios.patch(
        `/api/auth/update-user/${props.userid}`,
        {
          pin,
          confirmPin: value,
        },
        {
          headers: {
            Authorization: "Bearer " + auth.accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      setPin(null);

      setstatus({ loading: false, signed: true });
      await timeout(2000);
      setstatus({ ...status, signed: false });

      props.tokenHandler({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
      props.setupPin();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid>
      <Grid.Column>
        <Header inverted as="h1">
          Welcome to Kiosk. Please set up your pin
        </Header>

        {status.signed ? (
          <Image src={signSuccessfullImage} centered />
        ) : status.loading ? (
          <Loading message="Signing up..." />
        ) : !pin ? (
          <Numpad
            heading="Enter 4-digit PIN"
            onpinSubmit={(value) => setPin(value)}
            cancel={() => props.setupPin()}
          />
        ) : (
          <Numpad
            heading="Re-Enter 4-digit PIN"
            onpinSubmit={(value) => submitClickHandler(value)}
            cancel={() => props.setupPin()}
          />
        )}
      </Grid.Column>
    </Grid>
  );
}

export default SetupPin;
