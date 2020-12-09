import React, { useContext, useState } from "react";
import FilledInstrument from "./FilledInstrument";
import Loading from "../../../components/Loader/Loading";

import { AuthContext } from "../../../context/auth-context";
import { Button, Grid } from "semantic-ui-react";

function RemoveSamplesFromInstrument(props) {
  const auth = useContext(AuthContext);
  const axios = auth.getAxiosInstance;
  const [loading, setloading] = useState(false);

  /*************Bug not catching error*************/
  const removeSampleFromInstrumentClickHandler = async () => {
    const response = window.confirm("Are you sure?");
    if (response) {
      setloading(true);
      try {
        await axios
          .patch(
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
          )
          .catch((err) => {
            if (err.response.status === 403) {
              console.error("Errror.....", err);
              setloading(false);
              window.alert("Test still running");
            }
            throw err;
          });

        setloading(false);
        props.updateHomePage(null);
      } catch (error) {
        console.error("Errror.....", error);
        setloading(false);
      }
    }
  };

  const onCancelClickHandler = () => {
    props.stayAtLoadedInstrumentPage({ status: false });
  };

  return loading ? (
    <Loading message="Updating..." />
  ) : (
    <Grid centered>
      <FilledInstrument loadedInstrumentInfo={props.loadedInstrumentInfo} />
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
            onClick={removeSampleFromInstrumentClickHandler}
          >
            Remove
          </Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default RemoveSamplesFromInstrument;
