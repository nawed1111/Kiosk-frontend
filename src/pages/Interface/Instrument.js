import React, { useState, useEffect } from "react";
import openSocket from "socket.io-client";

import Scan from "../../components/Scan/Scan";
import Timer from "../../components/Timer/Timer";

function Instrument(props) {
  const [samples, setSamples] = useState([]);
  const [doneScanning, setDoneScanning] = useState(false);
  const [time, setTime] = useState();
  const [runTest, setRunTest] = useState(false);
  const [timestamp, setTimestamp] = useState();

  const doneClickHandler = () => {
    // console.log("samples ", samples);
    setDoneScanning(true);
  };

  const setTimeHandler = (event) => {
    setTime(event.target.value);
  };

  const runTestHandler = () => {
    const response = window.confirm("Are you sure?");

    if (response) {
      setRunTest(true);
      setTimestamp(new Date().getTime());
      setTimeout(() => {
        alert("Time's up");
      }, +time * 60 * 1000);
    }
  };

  useEffect(() => {
    const socket = openSocket("http://localhost:5000", {
      transports: ["websocket"],
    });
    const pathName = window.location.pathname;
    const kioskId = pathName.split("/")[1];
    socket.emit("joinSampleRoom", kioskId + "-samples");

    socket.on("scannedSample", (data) => {
      setSamples(samples.concat(data));
    });

    socket.on("disconnect", () => {
      console.log("Application server disconnected!");
      socket.on("connect", () => {
        socket.emit("joinSampleRoom", kioskId + "-samples");
        console.log("Application server connected back!");
      });
    });
  }, [samples]);

  const renderSamples = samples.map((sample, index) => (
    <div>
      <p>
        <strong>({index + 1}) </strong>Sample ID: {sample.id}
      </p>
      <p>Sample Name: {sample.name}</p>
    </div>
  ));

  const InstrumnetPage = (
    <div>
      <h3> ID: {props.instrument.id} </h3>
      {props.instrument.loaded ? undefined : <Scan name="Samples" />}
      <h4>Scanned Samples: </h4>
      {renderSamples}
      <button onClick={doneClickHandler}>Done</button>
    </div>
  );

  const ReviewPage = (
    <div>
      <h3>List of samples scanned</h3>
      {renderSamples}
      <label for="time">Enter time: </label>
      <input
        type="text"
        value={time}
        id="time"
        onChange={(event) => setTimeHandler(event)}
      />
      <button onClick={runTestHandler}>Run Test</button>
    </div>
  );

  const RunTestPage = (
    <div>
      <h3>
        Running Test in <em>{props.instrument.name}</em>
      </h3>
      <p>Samples in test</p>
      {renderSamples}
      <p>Recommended Temperature: {props.instrument.recommendedTemperature} </p>
      <p>
        Time Remaining: <Timer minutes={+time} timestamp={timestamp} />
      </p>
      <button>Remove now</button>
      <button>Run in background</button>
    </div>
  );

  return doneScanning ? (runTest ? RunTestPage : ReviewPage) : InstrumnetPage;
}

export default Instrument;
