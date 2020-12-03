import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth-context";

function InstrumentProperties(props) {
  const auth = useContext(AuthContext);
  const [instrument, setinstrument] = useState({
    id: "",
    name: "",
    properties: {},
  });

  useEffect(() => {
    async function helper() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/instruments/instrument/${props.instrument.instrumentid}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.accessToken,
            },
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setinstrument(responseData.instrument);
      } catch (error) {}
    }
    helper();
  }, [auth.accessToken, props.instrument]);

  return (
    <div>
      <input
        type="radio"
        value={props.instrument.instrumentid}
        name="instrument"
        onClick={props.instrumentHandler.bind(this, instrument)}
        hidden={instrument.status === "inuse"}
      />
      <p>{props.instrument.instrumentid}</p>
      <p>{props.instrument.name}</p>
      <p>{instrument.status}</p>
      {/* {Object.keys(instrument.properties).map((key, index) => (
        <p key={`${key}${index}`}>
          {key}: {instrument.properties[key].toString()}
        </p>
      ))} */}
    </div>
  );
}

export default InstrumentProperties;
