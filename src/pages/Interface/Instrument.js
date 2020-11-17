import React, { useState, useEffect } from "react";
import openSocket from "socket.io-client";

import Scan from "../../components/Scan/Scan";

function Instrument(props) {
  const [samples, setSamples] = useState([]);
  const [doneScanning, setDoneScanning] = useState(false);
  const [time, setTime] = useState();
  const [runTest, setRunTest] = useState(false);

  const doneClickHandler = () => {
    console.log("samples ", samples);
    setDoneScanning(true);
  };

  const setTimeHandler = (event) => {
    setTime(event.target.value);
  };

  const runTestHandler = () => {
    const response = window.confirm("Are you sure?");
    if (response) {
      setRunTest(true);
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
      <h3> ID: {props.id} </h3>
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

  return doneScanning ? (
    runTest ? (
      <div>Test Running</div>
    ) : (
      ReviewPage
    )
  ) : (
    InstrumnetPage
  );
}

export default Instrument;
