import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../context/auth-context";

import InstrumentPage from "./Instrument/Instrument";
import RemoveSamplesFromInstrumentPage from "./Instrument/RemoveSamplesFromInstrument";
// import InstrumentProperties from "../../components/Instrument/InstrumentProperties";
import RunningTests from "./Instrument/RunningTests";

function Home() {
  const _KIOSK_ID = localStorage.getItem("kioskId");
  const auth = useContext(AuthContext);
  auth.setInterceptors();
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

  const logoutHandler = async () => {
    try {
      await auth.getAxiosInstance.delete(
        `/api/auth/logout`,
        {
          data: { refreshToken: auth.refreshToken },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      auth.logout();
      window.location.reload();
    } catch (error) {
      console.log(error);
      auth.logout();
      window.location.reload();
    }
  };

  const gobackToHomePage = () => {
    setSelected(false);
    setInstrument(null);
  };

  useEffect(() => {
    if (!selected) {
      async function helper() {
        try {
          const response = await auth.getAxiosInstance.get(
            `/api/instruments/${_KIOSK_ID}`,
            {
              headers: {
                Authorization: "Bearer " + auth.accessToken,
              },
            }
          );
          setInstrumentsOfKiosk({
            instruments: response.data.instruments,
            runningTests: response.data.testsRunning,
          });
        } catch (err) {
          console.log(err.response.data.message);
        }
      }
      helper();
    }
  }, [auth, _KIOSK_ID, selected, openLoadedInstrument]);

  const renderInstruments = instrumentsofKiosk.instruments.map(
    (instrument, index) => (
      <div key={`${instrument.instrumentid}${index}`}>
        <input
          type="radio"
          value={instrument.instrumentid}
          name="instrument"
          onClick={instrumentHandler.bind(this, instrument)}
          hidden={instrument.status === "inuse"}
        />
        <p>{instrument.instrumentid}</p>
        <p>{instrument.name}</p>
        <p>{instrument.status}</p>
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
        <button onClick={logoutHandler}>Logout</button>
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
