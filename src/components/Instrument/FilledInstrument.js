import React from "react";
import Timer from "../Timer/Timer";

function FilledInstrument(props) {
  const loadedInstrumentInfo = props.loadedInstrumentInfo;
  const { instrumentId, test } = loadedInstrumentInfo;
  return (
    <div>
      <p>Instrument Id: {instrumentId}</p>
      <p>List of samples: </p>
      {test.samples.map((sample, index) => (
        <div key={`${sample.id}${index}`}>
          <p>
            {`(${index + 1})`}Sample Name: {sample.name}
          </p>
          <p>Sample ID: {sample.id}</p>
        </div>
      ))}
      <p>Test duration: {test.duration}</p>
      <p>Test Started: {test.doneOn}</p>
      <p>Time remaining: </p>
      <Timer minutes={test.duration} timestamp={test.timestamp} />
      <p>Test done by: {test.doneBy}</p>
    </div>
  );
}

export default FilledInstrument;
