import React, { useContext } from "react";
import FilledInstrument from "../../components/Instrument/FilledInstrument";

import { AuthContext } from "../../context/auth-context";

const _KIOSK_ID = localStorage.getItem("kioskId");

function RemoveSamplesFromInstrument(props) {
  const auth = useContext(AuthContext);

  const removeSampleFromInstrumentClickHandler = async () => {
    const response = window.confirm("Are you sure?");
    if (response) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/samples/post-sample-removal",
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + auth.token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              kioskId: _KIOSK_ID,
              instrumentId: props.loadedInstrumentInfo.instrumentId,
            }),
          }
        );
        const responseData = response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        props.updateHomePage(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onCancelClickHandler = () => {
    props.stayAtLoadedInstrumentPage({ status: false });
  };

  return (
    <div>
      <FilledInstrument loadedInstrumentInfo={props.loadedInstrumentInfo} />
      <button onClick={onCancelClickHandler}>Cancel</button>
      <button onClick={removeSampleFromInstrumentClickHandler}>Remove</button>
    </div>
  );
}

export default RemoveSamplesFromInstrument;
