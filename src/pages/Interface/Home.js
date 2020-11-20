import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../context/auth-context";

import InstrumentPage from "./Instrument";
import LoadedInstrument from "./LoadedInstrument";

function Home(props) {
  const auth = useContext(AuthContext);
  const [instrument, setInstrument] = useState();
  const [selected, setSelected] = useState(false);
  const [intrumentsofKiosk, setInstrumentsOfKiosk] = useState([]);

  const [openLoadedInstrument, setLoadedIntrumnet] = useState({
    status: false,
    instrumentId: "",
  });

  const instrumentHandler = (data) => {
    setInstrument(data);
  };

  const toggleOpenLoadedInstrument = () => {
    setLoadedIntrumnet({ status: false });
  };

  const openLoadedInstrumentHandler = (instrumentId) => {
    setLoadedIntrumnet({ status: true, instrumentId });
  };
  const submitHandler = () => {
    if (instrument) {
      setSelected(true);
    }
  };

  const logoutHandler = () => {
    props.tokenHandler({});
  };

  useEffect(() => {
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
        setInstrumentsOfKiosk(responseData.instruments);
      } catch (err) {
        console.log(err);
      }
    }

    helper();
  }, [auth.token, props.kioskId]);

  const instruments = intrumentsofKiosk.map((instrument, index) => (
    <div key={`${instrument.id}${index}`}>
      <input
        type="radio"
        value={instrument.id}
        id={instrument.id}
        name="instrument"
        onClick={instrumentHandler.bind(this, instrument)}
        disabled={instrument.loaded}
      />
      <label htmlFor={instrument.id}>{instrument.name}</label>
      <p>Instrument status: {instrument.loaded ? "Filled" : "Empty"}</p>
      <p>
        Recommended Temperature: {instrument.recommendedTemperature} deg Celsius
      </p>
      <p>Description: {instrument.description} </p>
      <button
        hidden={!instrument.loaded}
        onClick={openLoadedInstrumentHandler.bind(this, instrument.id)}
      >
        Remove now
      </button>
    </div>
  ));

  const HomePage = (
    <div>
      <h1>Connected Instruments</h1>
      {instruments}
      <p />
      <button disabled={!instrument} onClick={submitHandler}>
        Submit
      </button>
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
        <InstrumentPage instrument={instrument} deSelect={setSelected} />
      ) : openLoadedInstrument.status ? (
        <LoadedInstrument
          instrumentId={openLoadedInstrument.instrumentId}
          returnHome={toggleOpenLoadedInstrument}
        />
      ) : (
        HomePage
      )}
    </>
  );
}

export default Home;
