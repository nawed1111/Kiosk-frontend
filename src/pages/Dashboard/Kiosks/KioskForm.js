import React, { useState } from "react";

import axios from "../../../util/axios";

import NewInstrumentForm from "../../Interface/Instrument/NewInstrumentForm";

function KioskForm(props) {
  const editkiosk = props.kiosk;
  // console.log("Kiosk: ", editkiosk);
  const [newKiosk, setNewKiosk] = useState({
    id: editkiosk.kioskId,
    instruments: [],
    rfreader: editkiosk.rfreader,
  });

  const [newInstrument, setNewInstrument] = useState({
    open: false,
    instrument: {},
  });
  const [instrumentId, setInstrumentId] = useState("");

  const addNewInstrumentClickHandler = (data) => {
    // console.log(data);
    // console.log(newKiosk.instruments);
    // if (newKiosk.instruments.includes(data)) {
    //   console.log(newKiosk.instruments);
    // }
    setNewKiosk({
      ...newKiosk,
      instruments: newKiosk.instruments.concat(data),
    });
    // setinstruments(instruments.concat(data));
    setNewInstrument({ open: false, instrument: {} });
    setInstrumentId("");
  };

  const instrumentIdInputOnChangeHandler = (event) => {
    event.preventDefault();
    setInstrumentId(event.target.value);
  };

  const kioskOperationHandler = async (event) => {
    // console.log(newKiosk);
    event.preventDefault();

    const { id, instruments, rfreader } = newKiosk;

    if (!id || instruments.length === 0) {
      return window.alert("Mandatory Fields cannot be blank");
    }

    let method, url;

    if (event.target.name === "create") {
      method = "POST";
      url = `/api/kiosks`;
    } else if (event.target.name === "update") {
      method = "PATCH";
      url = `/api/kiosks/${id}`;
    }

    try {
      const res = await axios({
        method,
        url,
        data: {
          kioskId: id,
          instruments,
          rfreader,
        },
      });
      console.log(res.data);
      props.goBack();
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const searchInstrumentClickHandler = async () => {
    try {
      const response = await axios.get(
        `/api/instruments/instrument/${instrumentId}`
      );

      setNewInstrument({ open: true, instrument: response.data.instrument });

      // console.log(responseData.instrument);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const renderPrevInstruments = editkiosk.instruments.map(
    (instrument, index) => (
      <div key={`${instrument._id}${index}`}>
        <p>
          <strong>({index + 1}) </strong>
          {instrument.name}
        </p>
      </div>
    )
  );

  const renderInstruments = newKiosk.instruments.map((instrument, index) => (
    <div key={`${instrument.id}${index}`}>
      <p>
        <strong>({index + 1}) </strong>
        {instrument.name}
      </p>
    </div>
  ));

  const renderRunningTests = editkiosk.samplesInTest.map((test, index) => (
    <div key={`${index}`}>
      <p>
        ({index + 1}) Instrument ID: {test.instrumentId}
      </p>
      <p>Duration: {test.duration} mins</p>
      <p>Done on: {test.doneOn}</p>
      <p>Done By: {test.doneBy}</p>
    </div>
  ));

  return (
    <div>
      <h3>Kiosk Form </h3>
      <label>
        *Kiosk ID:
        <input
          minLength="8"
          value={newKiosk.id || editkiosk.kioskId}
          readOnly={editkiosk.kioskId}
          onChange={(event) =>
            setNewKiosk({ ...newKiosk, id: event.target.value })
          }
        />
      </label>

      <p> *Add instrument: </p>
      <p />

      <label>
        Search instrument
        <input
          name="instrument"
          placeholder="instrument id"
          value={instrumentId}
          onChange={(event) => instrumentIdInputOnChangeHandler(event)}
        />
      </label>
      <button onClick={searchInstrumentClickHandler}>Search</button>
      {newInstrument.open ? (
        <NewInstrumentForm
          instrument={newInstrument.instrument}
          add={addNewInstrumentClickHandler}
        />
      ) : undefined}
      {renderPrevInstruments}
      {renderInstruments}
      <p />
      <label>
        RFReader:
        <input
          minLength="8"
          value={newKiosk.rfreader || editkiosk.rfreader}
          required
          placeholder="refreader id"
          readOnly={editkiosk.kioskId}
          onChange={(event) =>
            setNewKiosk({ ...newKiosk, rfreader: event.target.value })
          }
        />
      </label>
      {editkiosk.kioskId ? (
        <div>
          <h3>Tests Running </h3>
          {renderRunningTests}
        </div>
      ) : undefined}

      <p />
      <button
        onClick={kioskOperationHandler}
        disabled={newKiosk.id.length < 9}
        name={editkiosk.kioskId ? "update" : "create"}
      >
        {editkiosk.kioskId ? "Update" : "Create"}
      </button>
    </div>
  );
}

export default KioskForm;
