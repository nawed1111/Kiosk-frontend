import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/auth-context";

function SetupPin(props) {
  const auth = useContext(AuthContext);
  const axios = auth.getAxiosInstance;
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const submitClickHandler = async (event) => {
    event.preventDefault();
    if (pin !== confirmPin) return;

    try {
      const response = await axios.patch(
        `/api/auth/update-user/${props.userid}`,
        {
          pin,
          confirmPin,
        },
        {
          headers: {
            Authorization: "Bearer " + auth.accessToken,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) {
        throw new Error(response.message);
      }

      setPin(null);
      setConfirmPin(null);
      props.handleSubmit();
    } catch (error) {
      console.log(error);
    }
  };

  const pinChangeHandler = (event) => {
    event.preventDefault();
    if (isNaN(event.target.value)) return;

    if (event.target.name === "pin") {
      setPin(event.target.value);
    } else {
      setConfirmPin(event.target.value);
      if (pin !== event.target.value)
        console.log("Confirm pin do not match with pin");
    }
  };

  return (
    <div>
      <form onSubmit={(event) => submitClickHandler(event)}>
        <label>
          PIN:
          <input
            type="password"
            name="pin"
            required
            pattern="[0-9]*"
            // inputmode="numeric"
            maxLength="4"
            minLength="4"
            size="4"
            value={String(pin)}
            onChange={(event) => pinChangeHandler(event)}
          />
        </label>

        <br />
        <label>
          Confirm PIN:
          <input
            name="confirmPin"
            type="password"
            required
            maxLength="4"
            minLength="4"
            size="4"
            pattern="[0-9]*"
            // inputmode="numeric"
            value={String(confirmPin)}
            onChange={(event) => pinChangeHandler(event)}
          />
        </label>
        <br />
        <input
          type="submit"
          value="Submit"
          disabled={pin !== confirmPin || String(pin).length < 4}
        />
      </form>
    </div>
  );
}

export default SetupPin;
