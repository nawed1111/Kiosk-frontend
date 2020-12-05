import React from "react";
import Timer from "../../../components/Timer/Timer";

export default function RunningTests(props) {
  const test = props.test;

  return (
    <div key={`${test.id}`}>
      <p>Instrument Id: {test.instrumentId}</p>
      <p>Number of samples: {test.samples.length} </p>
      <p>Test duration: {test.duration} mins</p>
      <p>Test Started: {test.doneOn.split("GMT")[0]}</p>
      <p>Time remaining: </p>
      <Timer minutes={test.duration} timestamp={test.timestamp} />
      <p>Test done by: {test.doneBy}</p>
      <button
        onClick={props.openLoadedInstrumentHandler.bind(
          this,
          test.instrumentId
        )}
      >
        Remove Now
      </button>
    </div>
  );
}