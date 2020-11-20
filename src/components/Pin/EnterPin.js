import React, { useState } from "react";

const EnterPin = (props) => {
  const [pin, setPin] = useState("");

  const pinInputHandler = (event) => {
    setPin(event.target.value);
  };
  const pinSubmitHandler = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-pin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: props.user,
            pin: pin,
          }),
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        alert("Invalid Login");
        throw new Error(responseData.message);
      }
      // auth.login(responseData.userId, responseData.token);
      // console.log(responseData.token);
      props.tokenHandler({
        token: responseData.token,
        userId: responseData.userId,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <label htmlFor="pin">Enter Pin </label>
      <input
        type="text"
        id="pin"
        value={pin}
        onChange={(event) => pinInputHandler(event)}
      ></input>
      <button onClick={pinSubmitHandler}>Submit</button>
    </div>
  );
};

export default EnterPin;
