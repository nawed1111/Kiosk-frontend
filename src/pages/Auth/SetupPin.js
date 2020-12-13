import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import axios from "../../util/axios";

import { Grid, Image, Header } from "semantic-ui-react";

import Numpad from "../../components/Pin/Numpad";
import Loading from "../../components/Loader/Loading";
import signSuccessfullImage from "../../assets/images/sign-successfull.png";

function SetupPin(props) {
  const auth = useContext(AuthContext);
  const [pin, setPin] = useState("");
  const [hideError, sethideError] = useState(true);
  const [status, setstatus] = useState({
    loading: false,
    signed: false,
  });

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const submitClickHandler = async (value) => {
    if (pin !== value) return sethideError(false);

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
      if (error.response) return console.log(error);
      window.alert("Possible error- Server not connected! Contact admin");
    }
  };

  return (
    <Grid centered>
      <Grid.Column textAlign="center">
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
            hideError={true}
            content=""
            sethideError={() => sethideError(true)}
          />
        ) : (
          <Numpad
            heading="Re-Enter 4-digit PIN"
            onpinSubmit={(value) => submitClickHandler(value)}
            cancel={() => props.setupPin()}
            hideError={hideError}
            content="Pin mismatch. Please re-enter your pin Or scan your card to start again"
            sethideError={() => sethideError(true)}
          />
        )}
      </Grid.Column>
    </Grid>
  );
}

export default SetupPin;
