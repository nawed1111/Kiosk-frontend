import React from "react";
import Timer from "../../../components/Timer/Timer";

function FilledInstrument(props) {
  const loadedInstrumentInfo = props.loadedInstrumentInfo;
  const { test } = loadedInstrumentInfo;
  return (
    <div>
      <p>Instrument Id: {test.instrumentId}</p>
      <p>List of samples: </p>
      {test.samples.map((sample, index) => (
        <div key={`${sample.sampleid}${index}`}>
          <p>
            {`(${index + 1}) `}
            {sample.sampleid}
          </p>
        </div>
      ))}
      <p>Test duration: {test.duration}</p>
      <p>Test Started: {test.doneOn.split("GMT")[0]}</p>
      <p>Time remaining: </p>
      <Timer minutes={test.duration} timestamp={test.timestamp} />
      <p>Test done by: {test.doneBy}</p>
    </div>
  );
}

export default FilledInstrument;
