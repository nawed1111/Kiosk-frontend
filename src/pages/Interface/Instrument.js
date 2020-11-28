import React, { useState, useEffect, useRef, useContext } from "react";

import { getSocket } from "../../util/socket";

import Scan from "../../components/Scan/Scan";
import Timer from "../../components/Timer/Timer";
import { AuthContext } from "../../context/auth-context";

const _KIOSK_ID = localStorage.getItem("kioskId");

function Instrument(props) {
  const auth = useContext(AuthContext);
  const _isMounted = useRef(true);
  const [samples, setSamples] = useState([]);
  const [doneScanning, setDoneScanning] = useState(false);
  const [time, setTime] = useState();
  const [runTest, setRunTest] = useState(false);
  const [timestamp, setTimestamp] = useState();

  const doneClickHandler = () => {
    // console.log("samples ", samples);
    setDoneScanning(!doneScanning);
  };

  const setTimeHandler = (event) => {
    event.preventDefault();
    setTime(event.target.value);
  };

  const addSampleInputSubmitHandler = async (event) => {
    event.preventDefault();
    const {
      target: { id, name },
    } = event;

    try {
      const response = await fetch(
        `http://localhost:5000/api/samples/${_KIOSK_ID}/${id.value}`
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setSamples(samples.concat({ id: id.value, name: name.value }));
    } catch (error) {
      console.log(error);
    }
  };

  const runTestHandler = async () => {
    const response = window.confirm("Are you sure?");

    if (response) {
      setRunTest(true);
      setTimestamp(new Date().getTime());
      setTimeout(() => {
        alert("Time's up");
      }, +time * 60 * 1000);

      try {
        const response = await fetch(
          "http://localhost:5000/api/samples/run-test",
          {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + auth.token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              instrumentId: props.instrument.id,
              samples,
              duration: time,
              timestamp: new Date().getTime(),
              kioskId: _KIOSK_ID,
              user: auth.user,
            }),
          }
        );
        const responseData = await response.json();
        // console.log(responseData);
        if (!response.ok) {
          throw new Error(responseData.message);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const goBackToHomePage = () => {
    props.deSelect();
  };

  useEffect(() => {
    const socket = getSocket();

    if (!doneScanning) {
      //bug
      socket.on("scannedSample", (data) => {
        setSamples(samples.concat(data));
      });
    }

    return () => {
      _isMounted.current = false;
      socket.off("scannedSample");
    };
  }, [samples, doneScanning]);

  const renderSamples = samples.map((sample, index) => (
    <div key={`${sample.id}${index}`}>
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
      <p>OR</p>
      <form onSubmit={(event) => addSampleInputSubmitHandler(event)}>
        <label>
          Sample ID:
          <input type="text" name="id" required />
        </label>
        <label>
          Sample Name:
          <input type="text" name="name" required />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {renderSamples}
      <button onClick={goBackToHomePage}>Go Back</button>
      <button disabled={samples.length === 0} onClick={doneClickHandler}>
        Done
      </button>
    </div>
  );

  const ReviewPage = (
    <div>
      <h3>List of samples scanned</h3>
      {renderSamples}
      <p>Want to add more samples? Go Back </p>
      <label htmlFor="time">Enter time in minutes: </label>
      <input
        type="text"
        value={time}
        id="time"
        onChange={(event) => setTimeHandler(event)}
      />
      <button disabled={isNaN(time) || +time <= 0} onClick={runTestHandler}>
        Run Test
      </button>
      <button onClick={doneClickHandler}>Go Back</button>
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
      <p>Time Remaining:</p>
      <Timer minutes={+time} timestamp={timestamp} />
      <button onClick={goBackToHomePage}>Run in background</button>
    </div>
  );

  return doneScanning ? (runTest ? RunTestPage : ReviewPage) : InstrumnetPage;
}

export default Instrument;
