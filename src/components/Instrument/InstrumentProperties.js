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
          `http://localhost:5000/api/instruments/instrument/${props.instrument.id}`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + auth.token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              properties: props.instrument.properties,
            }),
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
  }, [auth.token, props.instrument]);

  return (
    <div>
      <input
        type="radio"
        value={instrument.id}
        id={instrument.id}
        name="instrument"
        onClick={props.instrumentHandler.bind(this, instrument)}
        hidden={instrument.properties.isFilled}
      />
      <label htmlFor={instrument.id}>{instrument.name}</label>
      {Object.keys(instrument.properties).map((key, index) => (
        <p key={`${key}${index}`}>
          {key}: {instrument.properties[key].toString()}
        </p>
      ))}
    </div>
  );
}

export default InstrumentProperties;
