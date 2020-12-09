import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import Numpad from "./Numpad";
import { Header, Image } from "semantic-ui-react";

import Loading from "../../components/Loader/Loading";

import signSuccessfullImage from "../../assets/images/sign-successfull.png";

const EnterPin = (props) => {
  const auth = useContext(AuthContext);
  const axios = auth.getAxiosInstance;
  const [status, setstatus] = useState({
    loading: false,
    signed: false,
  });

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const pinSubmitHandler = async (pin) => {
    setstatus({ ...status, loading: true });
    try {
      const response = await axios.post(
        "/api/auth/verify-pin",
        {
          userid: props.userid,
          pin: pin,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message);
      }

      setstatus({ loading: false, signed: true });
      await timeout(2000);
      setstatus({ ...status, signed: false });

      props.tokenHandler({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
    } catch (err) {
      setstatus({ ...status, loading: false });
      alert(err.response.data.error.message);
    }
  };

  return (
    <>
      <Header inverted as="h1">
        Welcome to Kiosk
      </Header>
      {status.signed ? (
        <Image src={signSuccessfullImage} centered />
      ) : status.loading ? (
        <Loading message="Checking..." />
      ) : (
        <Numpad
          heading="Enter 4-digit PIN"
          onpinSubmit={(value) => pinSubmitHandler(value)}
          cancel={props.onCancel}
        />
      )}
    </>
  );
};

export default EnterPin;
