import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../context/auth-context";

import InstrumentPage from "./Instrument";
import RemoveSamplesFromInstrumentPage from "./RemoveSamplesFromInstrument";
import Timer from "../../components/Timer/Timer";

function Home(props) {
  const auth = useContext(AuthContext);
  const [instrument, setInstrument] = useState(null);
  const [selected, setSelected] = useState(false);
  const [instrumentsofKiosk, setInstrumentsOfKiosk] = useState({
    emptyInstruments: [],
    filledInstruments: [],
  });

  const [openLoadedInstrument, setLoadedIntrument] = useState({
    status: false,
    instrumentId: null,
  });

  const instrumentHandler = (data) => {
    setInstrument(data);
  };

  const openLoadedInstrumentHandler = (instrumentId) => {
    setLoadedIntrument({ status: !openLoadedInstrument.status, instrumentId });
    setSelected(false);
    setInstrument(null);
  };
  const submitHandler = () => {
    if (instrument) {
      setSelected(true);
    }
  };

  const logoutHandler = () => {
    props.tokenHandler({});
  };

  const runTestInBackgroundHnadler = () => {
    setSelected(false);
    setInstrument(null);
  };

  useEffect(() => {
    if (!selected) {
      async function helper() {
        try {
          const response = await fetch(
            `http://localhost:5000/api/instruments/${props.kioskId}`,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + auth.token,
              },
            }
          );
          const responseData = await response.json();
          // console.log(responseData);
          setInstrumentsOfKiosk({
            emptyInstruments: responseData.instruments,
            filledInstruments: responseData.testsRunning,
          });
          // console.log(responseData.testsRunning);
        } catch (err) {
          console.log(err);
        }
      }
      helper();
    }
  }, [auth.token, props.kioskId, selected, openLoadedInstrument]);

  const EmptyInstruments = instrumentsofKiosk.emptyInstruments.map(
    (instrument, index) => (
      <div key={`${instrument.id}${index}`}>
        <input
          type="radio"
          value={instrument.id}
          id={instrument.id}
          name="instrument"
          onClick={instrumentHandler.bind(this, instrument)}
          // disabled={instrument.filled}
        />
        <label htmlFor={instrument.id}>{instrument.id}</label>
        <p>Instrument status: {instrument.filled ? "Filled" : "Empty"}</p>
        <p>
          Recommended Temperature: {instrument.recommendedTemperature} deg
          Celsius
        </p>
        {/* <button
          hidden={!instrument.filled}
          onClick={openLoadedInstrumentHandler.bind(this, instrument.id)}
        >
          Remove now
        </button> */}
      </div>
    )
  );

  const FilledInstruments = instrumentsofKiosk.filledInstruments.map(
    (test, index) => (
      <div key={`${test.id}${index}`}>
        <p>Instrument Id: {test.instrumentId}</p>
        <p>Number of samples: {test.samples.length} </p>
        {/* {test.samples.map((sample, index) => (
          <div key={`${sample._id}${index}`}>
            <p>
              {`(${index + 1})`}Sample Name: {sample.name}
            </p>
            <p>Sample ID: {sample.id}</p>
          </div>
        ))} */}
        <p>Test duration: {test.duration}</p>
        <p>Test Started: {test.doneOn}</p>
        <p>Time remaining: </p>
        <Timer minutes={test.duration} timestamp={test.timestamp} />
        <p>Test done by: {test.doneBy}</p>
        <button
          onClick={openLoadedInstrumentHandler.bind(this, test.instrumentId)}
        >
          Remove Now
        </button>
      </div>
    )
  );

  const HomePage = (
    <div>
      <h1>Connected Instruments </h1>
      <h2>Instruments Empty: {instrumentsofKiosk.emptyInstruments.length}</h2>
      {EmptyInstruments}
      <p />
      <button disabled={!instrument} onClick={submitHandler}>
        Submit
      </button>
      <h2>
        Instruments Running Test: {instrumentsofKiosk.filledInstruments.length}
      </h2>
      {FilledInstruments}
      <p />
    </div>
  );

  return (
    <>
      <nav>
        <a href={`/${props.kioskId}`} onClick={logoutHandler}>
          Logout
        </a>
      </nav>
      {selected ? (
        <InstrumentPage
          instrument={instrument}
          deSelect={runTestInBackgroundHnadler}
        />
      ) : openLoadedInstrument.status ? (
        <RemoveSamplesFromInstrumentPage
          kioskId={props.kioskId}
          loadedInstrumentInfo={{
            instrumentId: openLoadedInstrument.instrumentId,
            test: instrumentsofKiosk.filledInstruments.find(
              (test) => test.instrumentId === openLoadedInstrument.instrumentId
            ),
          }}
          stayAtLoadedInstrumentPage={setLoadedIntrument}
          updateHomePage={openLoadedInstrumentHandler}
        />
      ) : (
        HomePage
      )}
    </>
  );
}

export default Home;
