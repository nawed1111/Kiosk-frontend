import React, { useState } from "react";

import InstrumentPage from "./Instrument";
import LoadedInstrument from "./LoadedInstrument";

function Home(props) {
  const [instrument, setInstrument] = useState({});
  const [selected, setSelected] = useState(false);
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
    props.tokenHandler("");
  };

  const instruments = props.kioskInfo.instruments.map((instrument, index) => (
    <div>
      <input
        type="radio"
        key={`${instrument.id}${index}`}
        value={instrument.id}
        id={instrument.id}
        name="instrument"
        onClick={instrumentHandler.bind(this, instrument)}
        disabled={instrument.loaded}
      />
      <label for={instrument.id}>{instrument.name}</label>
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
        <a href={`/${props.kioskInfo.id}`} onClick={logoutHandler}>
          Logout
        </a>
      </nav>
      {selected ? (
        <InstrumentPage instrument={instrument} />
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
