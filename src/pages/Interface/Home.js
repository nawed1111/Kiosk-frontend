import React, { useState } from "react";

import InstrumentPage from "./Instrument";

function Home(props) {
  const [instrument, setInstrument] = useState();
  const [selected, setSelected] = useState(false);

  const instrumentHandler = (event) => {
    setInstrument(event.target.value);
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
        value={instrument}
        id={instrument.id}
        name="instrument"
        onClick={(event) => instrumentHandler(event)}
        disabled={instrument.loaded}
      />
      <label for={instrument.id}>{instrument.name}</label>
      <p>Instrument status: {instrument.loaded ? "Filled" : "Empty"}</p>
      <p>
        Recommended Temperature: {instrument.recommendedTemperature} deg Celsius
      </p>
      <p>Description: {instrument.description} </p>
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
      {selected ? <InstrumentPage instrument={instrument} /> : HomePage}
    </>
  );
}

export default Home;
