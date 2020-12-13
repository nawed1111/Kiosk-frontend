import React, { useState } from "react";
import axios from "../../../util/axios";

import FilledInstrument from "./FilledInstrument";
import Loading from "../../../components/Loader/Loading";
import Alert from "../../../components/Alert/Alert";

import { Button, Confirm, Grid } from "semantic-ui-react";

function RemoveSamplesFromInstrument(props) {
  const [loading, setloading] = useState(false);
  const [open, setopen] = useState(false);
  const [hideError, sethideError] = useState(true);

  const removeSampleFromInstrumentClickHandler = async () => {
    const { timestamp, duration } = props.loadedInstrumentInfo.test;
    const date = new Date(timestamp + duration * 60 * 1000);
    const difference = +date - +new Date();
    if (difference > 0) return sethideError(false);

    setloading(true);

    try {
      await axios.patch("/api/test/post-sample-removal", {
        testId: props.loadedInstrumentInfo.test._id,
      });

      setloading(false);
      props.updateInstrumentStatus();
      props.updateHomePage(null);
    } catch (err) {
      setloading(false);
      if (err.response) return console.log(err.response.data.error.message);
      window.alert("Possible error- Server not connected! Contact admin");
    }
  };

  const onCancelClickHandler = () => {
    props.stayAtLoadedInstrumentPage();
  };

  return loading ? (
    <Loading message="Updating..." />
  ) : (
    <Grid centered>
      <FilledInstrument loadedInstrumentInfo={props.loadedInstrumentInfo} />

      <Grid.Row>
        <Alert
          hideError={hideError}
          content="You can not remove samples as instrument is still running test."
        />
      </Grid.Row>

      <Grid.Row columns="2" textAlign="center">
        <Grid.Column textAlign="right">
          <Button
            basic
            color="teal"
            size="large"
            circular
            onClick={onCancelClickHandler}
          >
            Cancel
          </Button>
        </Grid.Column>
        <Grid.Column>
          <Button
            basic
            color="red"
            size="large"
            circular
            onClick={() => setopen(true)}
          >
            Remove
          </Button>
          <Confirm
            open={open}
            content="Please confirm if you want to remove samples from the instrument?"
            cancelButton="Cancel"
            confirmButton="Yes"
            onCancel={() => setopen(false)}
            size="mini"
            onConfirm={() => {
              setopen(false);
              removeSampleFromInstrumentClickHandler();
            }}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default RemoveSamplesFromInstrument;
