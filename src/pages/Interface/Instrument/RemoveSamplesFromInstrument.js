import React, { useContext } from "react";
import FilledInstrument from "./FilledInstrument";

import { AuthContext } from "../../../context/auth-context";

function RemoveSamplesFromInstrument(props) {
  const auth = useContext(AuthContext);
  const axios = auth.getAxiosInstance;

  const removeSampleFromInstrumentClickHandler = async () => {
    const response = window.confirm("Are you sure?");
    if (response) {
      try {
        const response = await axios.patch(
          "/api/test/post-sample-removal",
          {
            testId: props.loadedInstrumentInfo.test._id,
          },
          {
            headers: {
              Authorization: "Bearer " + auth.accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 403) {
          window.alert("Test still running");
        }
        props.updateHomePage(null);
      } catch (error) {
        console.log(error.response.data.message);
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
