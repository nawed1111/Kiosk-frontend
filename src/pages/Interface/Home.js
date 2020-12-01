import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../context/auth-context";

import InstrumentPage from "./Instrument";
import RemoveSamplesFromInstrumentPage from "./RemoveSamplesFromInstrument";
import InstrumentProperties from "../../components/Instrument/InstrumentProperties";
import RunningTests from "../../components/Instrument/RunningTests";

const _KIOSK_ID = localStorage.getItem("kioskId");

function Home(props) {
  const auth = useContext(AuthContext);
  const [instrument, setInstrument] = useState(null);
  const [selected, setSelected] = useState(false);

  const [instrumentsofKiosk, setInstrumentsOfKiosk] = useState({
    instruments: [],
    runningTests: [],
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

  const gobackToHomePage = () => {
    setSelected(false);
    setInstrument(null);
  };

  useEffect(() => {
    if (!selected) {
      async function helper() {
        try {
          const response = await fetch(
            `http://localhost:5000/api/instruments/${_KIOSK_ID}`,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + auth.token,
              },
            }
          );
          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(responseData.message);
          }
          setInstrumentsOfKiosk({
            instruments: responseData.instruments,
            runningTests: responseData.testsRunning,
          });
        } catch (err) {
          console.log(err);
        }
      }
      helper();
      // return () => setInstrumentsOfKiosk({ instruments: [], runningTests: [] });
    }
  }, [auth.token, selected, openLoadedInstrument]);

  const renderInstruments = instrumentsofKiosk.instruments.map(
    (instrument, index) => (
      <div key={`${instrument.id}${index}`}>
        <InstrumentProperties
          instrument={instrument}
          instrumentHandler={instrumentHandler}
        />
      </div>
    )
  );

  const TestsRunning = instrumentsofKiosk.runningTests.map((test, index) => (
    <div key={`${test._id}${index}`}>
      <RunningTests
        test={test}
        openLoadedInstrumentHandler={openLoadedInstrumentHandler}
      />
    </div>
  ));

  const HomePage = (
    <div>
      <h1>Connected Instruments </h1>

      {renderInstruments}
      <p />
      <button disabled={!instrument} onClick={submitHandler}>
        Submit
      </button>
      <h2>
        Instruments Running Test: {instrumentsofKiosk.runningTests.length}
      </h2>
      {TestsRunning}
      <p />
    </div>
  );

  return (
    <>
      <nav>
        <a href={`/${_KIOSK_ID}`} onClick={logoutHandler}>
          Logout
        </a>
      </nav>
      {selected ? (
        <InstrumentPage instrument={instrument} deSelect={gobackToHomePage} />
      ) : openLoadedInstrument.status ? (
        <RemoveSamplesFromInstrumentPage
          loadedInstrumentInfo={{
            test: instrumentsofKiosk.runningTests.find(
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
