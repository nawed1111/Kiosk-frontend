import React, { useState, useEffect, useContext } from "react";
import axios from "../../../util/axios";
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
        const response = await axios.get(
          `/api/instruments/instrument/${props.instrument.instrumentid}`
        );
        console.log("Response: ", response);
        setinstrument(response.data.instrument);
      } catch (error) {
        console.log(error);
      }
    }
    helper();
  }, [auth, props.instrument]);

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
