import React, { useContext } from "react";
import FilledInstrument from "../../components/Instrument/FilledInstrument";

import { AuthContext } from "../../context/auth-context";

function RemoveSamplesFromInstrument(props) {
  const auth = useContext(AuthContext);

  const removeSampleFromInstrumentClickHandler = async () => {
    const response = window.confirm("Are you sure?");
    if (response) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/test/post-sample-removal",
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + auth.accessToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              testId: props.loadedInstrumentInfo.test._id,
            }),
          }
        );
        const responseData = response.json();
        console.log(responseData);
        if (response.status === 403) {
          window.alert("Test still running");
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
