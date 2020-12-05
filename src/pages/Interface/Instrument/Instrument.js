import React, { useState, useEffect, useRef, useContext } from "react";

import { getSocket } from "../../../util/socket";

import Scan from "../../../components/Scan/Scan";
import Timer from "../../../components/Timer/Timer";
import { AuthContext } from "../../../context/auth-context";

function Instrument(props) {
  const _KIOSK_ID = localStorage.getItem("kioskId");
  const auth = useContext(AuthContext);
  const axios = auth.getAxiosInstance;
  const _isMounted = useRef(true);
  const [samples, setSamples] = useState([]);
  const [doneScanning, setDoneScanning] = useState(false);
  const [recommendedProp, setrecommendedProp] = useState({
    time: null,
    timeUnit: null,
    temp: null,
    tempUnit: null,
  });
  const [runTest, setRunTest] = useState(false);
  const [timestamp, setTimestamp] = useState();

  const doneClickHandler = () => {
    // console.log("samples ", samples);
    if (samples.length < 1) window.alert("Scan sample first!");
    else {
      setDoneScanning(!doneScanning);
    }
  };

  // const setTimeHandler = (event) => {
  //   event.preventDefault();
  //   setTime(event.target.value);
  // };

  const addSampleInputSubmitHandler = async (event) => {
    event.preventDefault();
    const sampleid = event.target.sampleid.value;

    try {
      const response = await axios.get(`/api/test/${_KIOSK_ID}/${sampleid}`);

      console.log(response.data.message);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const runTestHandler = async () => {
    const timestampOfExecution = new Date().getTime();
    setTimestamp(timestampOfExecution);

    try {
      const response = await axios.put(
        "/api/test/run-test",
        {
          instrumentId: props.instrument.instrumentid,
          samples,
          duration: recommendedProp.time / 60,
          timestamp: timestampOfExecution,
          kioskId: _KIOSK_ID,
          user: auth.user,
        },
        {
          headers: {
            Authorization: "Bearer " + auth.accessToken,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.message);
      setRunTest(true);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const goBackToHomePage = () => {
    props.deSelect();
  };

  useEffect(() => {
    const socket = getSocket();

    if (!doneScanning) {
      socket.on("scannedSample", (data) => {
        let flag = false;
        samples.forEach((sample) => {
          // console.log("Stored: ", sample, "Fteched: ", data);
          if (sample.sampleid === data.sampleid) {
            flag = true;
            return window.alert(`A sample with id ${data.sampleid} exists`);
          } else if (
            sample.recomtemp !== data.recomtemp ||
            sample.recomtempunits !== data.recomtempunits ||
            sample.recomduration !== data.recomduration ||
            sample.recomdurationunits !== data.recomdurationunits
          ) {
            flag = true;
            return window.alert(
              `Sample properties do not match Temperture ${data.recomtemp} Duration ${data.recomduration}`
            );
          }
        });
        if (!flag) setSamples(samples.concat(data));
      });
    }

    return () => {
      _isMounted.current = false;
      socket.off("scannedSample");
    };
  }, [samples, doneScanning]);

  useEffect(() => {
    if (samples.length === 1) {
      const firstSample = samples[0];
      const time =
        firstSample.recomdurationunits === "d"
          ? firstSample.recomduration * 24 * 60 * 60
          : firstSample.recomdurationunits === "h"
          ? firstSample.recomduration * 60 * 60
          : firstSample.recomdurationunits === "min"
          ? firstSample.recomduration * 60
          : firstSample.recomduration;
      setrecommendedProp({
        time: time,
        timeUnit: firstSample.recomdurationunits,
        temp: firstSample.recomtemp,
        tempUnit: firstSample.recomtempunits,
      });
    }
  }, [samples]);

  const renderSamples = samples.map((sample, index) => (
    <div key={`${sample.sampleid}${index}`}>
      <p>
        <strong>({index + 1}) </strong>
        {sample.sampleid}
      </p>
    </div>
  ));

  const RecommendedProperties = () => (
    <div>
      <p>Recommended Duration: {recommendedProp.time / 60} min</p>
      <p>
        Recommended Temperature: {recommendedProp.temp}
        {recommendedProp.tempUnit}
      </p>
    </div>
  );

  const InstrumnetPage = (
    <div>
      <h3> ID: {props.instrument.instrumentid} </h3>

      <Scan name="Samples" />

      <p>OR</p>
      <form onSubmit={(event) => addSampleInputSubmitHandler(event)}>
        <label>
          Sample ID:
          <input type="text" name="sampleid" required />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <h4>Scanned Samples: </h4>
      {renderSamples}
      {samples.length > 0 ? <RecommendedProperties /> : undefined}
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
      <RecommendedProperties />
      <p>Want to add more samples? Go Back </p>
      {/* <label htmlFor="time">Enter time in minutes: </label>
      <input
        type="text"
        value={time}
        id="time"
        onChange={(event) => setTimeHandler(event)}
      />
  */}
      <button disabled={samples.length < 1} onClick={runTestHandler}>
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
      <RecommendedProperties />
      {/* <p>Recommended Temperature: {props.instrument} </p> */}
      <p>Time Remaining:</p>
      <Timer minutes={recommendedProp.time / 60} timestamp={timestamp} />
      <button onClick={goBackToHomePage}>Run in background</button>
    </div>
  );

  return doneScanning ? (runTest ? RunTestPage : ReviewPage) : InstrumnetPage;
}

export default Instrument;
