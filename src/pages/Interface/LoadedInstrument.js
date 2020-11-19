import React from "react";

function LoadedInstrument(props) {
  return (
    <div>
      <h2>Loaded Instrument: {props.instrumentId}</h2>
      <button onClick={props.returnHome}> Cancel </button>
      <button>Remove</button>
    </div>
  );
}

export default LoadedInstrument;
