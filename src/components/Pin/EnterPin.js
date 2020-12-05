import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/auth-context";

const EnterPin = (props) => {
  const auth = useContext(AuthContext);
  const axios = auth.getAxiosInstance;
  const [pin, setPin] = useState("");

  const pinInputHandler = (event) => {
    setPin(event.target.value);
  };
  const pinSubmitHandler = async () => {
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
      props.tokenHandler({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
    } catch (err) {
      alert(err.response.data.error.message);
    }
  };
  return (
    <div>
      <label>
        Enter Pin
        <input
          type="password"
          id="pin"
          value={pin}
          onChange={(event) => pinInputHandler(event)}
        />
      </label>

      <button onClick={pinSubmitHandler}>Submit</button>
    </div>
  );
};

export default EnterPin;
