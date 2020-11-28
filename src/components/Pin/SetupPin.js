import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/auth-context";

function SetupPin(props) {
  const auth = useContext(AuthContext);
  const [pin, setPin] = useState(null);
  const [confirmPin, setConfirmPin] = useState(null);

  const submitClickHandler = async (event) => {
    event.preventDefault();

    if (pin !== confirmPin) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/create-user",
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pin,
            confirmPin,
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      console.log(responseData);

      setPin(null);
      setConfirmPin(null);
      props.handleSubmit(false);
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
            value={pin}
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
            value={confirmPin}
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
