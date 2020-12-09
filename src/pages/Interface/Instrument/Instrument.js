import React, { useState, useEffect, useRef, useContext } from "react";

import { getSocket } from "../../../util/socket";

import Scan from "../../../components/Scan/Scan";
import Timer from "../../../components/Timer/Timer";
import Loading from "../../../components/Loader/Loading";

import { AuthContext } from "../../../context/auth-context";
import {
  Grid,
  Header,
  Form,
  Icon,
  Button,
  Divider,
  Container,
  Image,
  List,
  Segment,
  Label,
} from "semantic-ui-react";

import sampleImage from "../../../assets/images/sample.png";
import orImage from "../../../assets/images/OR.png";
// import deleteImage from "../../../assets/images/delete.png";

function Instrument(props) {
  const _KIOSK_ID = localStorage.getItem("kioskId");
  const auth = useContext(AuthContext);
  const axios = auth.getAxiosInstance;
  const _isMounted = useRef(true);
  const [samples, setSamples] = useState([]);
  const [doneScanning, setDoneScanning] = useState(false);
  const [recommendedProp, setrecommendedProp] = useState({
    time: null,
    timeUnit: null,
    temp: null,
    tempUnit: null,
  });
  const [runTest, setRunTest] = useState(false);
  const [timestamp, setTimestamp] = useState();
  const [loading, setloading] = useState(false);

  const doneClickHandler = () => {
    if (samples.length < 1) window.alert("Add atleast one sample!");
    else {
      setDoneScanning(!doneScanning);
    }
  };

  const addSampleInputSubmitHandler = async (event) => {
    event.preventDefault();
    setloading(true);
    const sampleid = event.target.sampleid.value;

    try {
      await axios.get(`/api/test/${_KIOSK_ID}/${sampleid}`);

      setloading(false);
    } catch (error) {
      console.log(error.response.data.message);
      setloading(false);
      alert(error.response.data.message);
    }
  };
  /******************Delete a Sample 
  const removeASampleHandler = useCallback(
    (sampleid) => {
      const index = samples.findIndex((sample) => sample.sampleid === sampleid);
      // samples.splice(index, 1); 
    },
    [samples]
  );
******************/

  const runTestHandler = async () => {
    const timestampOfExecution = new Date().getTime();
    setTimestamp(timestampOfExecution);

    setloading(true);

    try {
      await axios.put(
        "/api/test/run-test",
        {
          instrumentId: props.instrument.instrumentid,
          samples,
          duration: recommendedProp.time / 60,
          timestamp: timestampOfExecution,
          kioskId: _KIOSK_ID,
          user: auth.user,
        },
        {
          headers: {
            Authorization: "Bearer " + auth.accessToken,
            "Content-Type": "application/json",
          },
        }
      );
      setloading(false);
      setRunTest(true);
    } catch (err) {
      console.log(err.response.data.message);
      setloading(false);
      alert(err.response.data.message);
    }
  };

  const goBackToHomePage = () => {
    props.deSelect();
  };

  useEffect(() => {
    const socket = getSocket();

    if (!doneScanning) {
      socket.on("scannedSample", (data) => {
        let flag = false;
        setloading(false);
        samples.forEach((sample) => {
          if (sample.sampleid === data.sampleid) {
            flag = true;
            return window.alert(`Sample ${data.sampleid} is already scanned.`);
          } else if (
            sample.recomtemp !== data.recomtemp ||
            sample.recomtempunits !== data.recomtempunits ||
            sample.recomduration !== data.recomduration ||
            sample.recomdurationunits !== data.recomdurationunits
          ) {
            flag = true;
            return window.alert(
              `Please scan samples which is to be stored at ${recommendedProp.temp}${recommendedProp.tempUnit} 
              for ${recommendedProp.time/60} mins only.`
            );
          }
        });
        if (!flag) setSamples(samples.concat(data));
      });
    }

    return () => {
      _isMounted.current = false;
      socket.off("scannedSample");
    };
  }, [samples, doneScanning]);

  useEffect(() => {
    if (samples.length === 1) {
      const firstSample = samples[0];
      const time =
        firstSample.recomdurationunits === "d"
          ? firstSample.recomduration * 24 * 60 * 60
          : firstSample.recomdurationunits === "h"
          ? firstSample.recomduration * 60 * 60
          : firstSample.recomdurationunits === "min"
          ? firstSample.recomduration * 60
          : firstSample.recomduration;
      setrecommendedProp({
        time: time,
        timeUnit: firstSample.recomdurationunits,
        temp: firstSample.recomtemp,
        tempUnit: firstSample.recomtempunits,
      });
    }
  }, [samples]);

  const renderSamples = samples.map((sample, index) => (
    <List.Item key={`${sample.sampleid}${index}`}>
      <Image size="mini" src={sampleImage} alt="sample" />
      <List.Content>
        <List.Header style={{ color: "white" }}>{sample.sampleid}</List.Header>
      </List.Content>
    </List.Item>
  ));

  const renderSamplesInReviewPage = samples.map((sample, index) => (
    <List.Item key={`${sample.sampleid}${index}`}>
      <Image size="mini" src={sampleImage} floated="left" centered />
      {/* <Button
            basic
            circular
            size="tiny"
            inverted
            floated="right"
            onClick={removeASampleHandler.bind(this, sample.sampleid)}
          >
            <Image size="mini" src={deleteImage} centered />
          </Button> */}

      <List.Content>
        <List.Header
          style={{ color: "white", fontSize: "25px", marginTop: ".5em" }}
        >
          {sample.sampleid}
        </List.Header>
      </List.Content>
    </List.Item>
  ));

  const RecommendedProperties = ({ context }) => (
    <Header as="h3" inverted>
      {context} {recommendedProp.temp}
      {recommendedProp.tempUnit} for {recommendedProp.time / 60} mins
    </Header>
  );

  const InstrumnetPage = (
    <Segment basic padded>
      <Grid>
        <Header as="h2" inverted>
          INSTRUMENT: {props.instrument.instrumentid}
        </Header>
        <Grid.Row columns={2}>
          <Grid.Column verticalAlign="middle">
            <Scan name="SAMPLES" />
          </Grid.Column>
          <Grid.Column verticalAlign="middle" textAlign="center">
            <Form onSubmit={(event) => addSampleInputSubmitHandler(event)}>
              <Form.Field inline>
                <Icon name="add to cart" size="large" color="teal" />
                <input
                  type="text"
                  name="sampleid"
                  placeholder="SAMPLE ID"
                  required
                />
                <Button
                  basic
                  color="teal"
                  style={{ marginLeft: "1em" }}
                  icon={<Icon name="plus" color="teal" />}
                />
              </Form.Field>
            </Form>
            {samples.length > 0 ? (
              <Container textAlign="center" style={{ marginTop: "2em" }}>
                <RecommendedProperties context="Samples to be stored at" />
                {/* <Header as="h2" color="grey">
                  SCANNED SAMPLES:
                </Header> */}
                <Grid centered>
                  <Grid.Row>
                    <List horizontal size="huge">
                      {renderSamples}
                    </List>
                  </Grid.Row>
                  <Grid.Row>
                    <Button
                      basic
                      color="teal"
                      size="big"
                      circular
                      onClick={doneClickHandler}
                    >
                      Done
                    </Button>
                  </Grid.Row>
                </Grid>
              </Container>
            ) : undefined}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Divider vertical>
        <Image
          size="mini"
          circular
          src={orImage}
          style={{ marginTop: "-1em " }}
        />
      </Divider>
    </Segment>
  );
  /***************For Testing only
  const RenderSamplesForTesting = () => {
    return (
      <List.Item>
        <Image size="mini" src={sampleImage} floated="left" centered />

        <List.Content>
          <List.Header
            style={{
              color: "grey",
              fontSize: "25px",
              marginTop: ".5em",
            }}
          >
            S-0003
          </List.Header>
        </List.Content>
      </List.Item>
    );
  };

*************/

  const ReviewPage = (
    <Segment basic padded>
      <Grid centered padded>
        <Grid.Row>
          <RecommendedProperties context="Samples to be stored at" />
        </Grid.Row>
        <Grid.Row>
          <List horizontal size="medium">
            {renderSamplesInReviewPage}
            {/*******************For Testing**********************/}

            {/***********************************************/}
          </List>
        </Grid.Row>
        <p>
          Want to add more samples?{"    "}
          {/* <Button
            basic
            color="teal"
            size="mini"
            circular
            onClick={doneClickHandler}
            icon={<Icon name="arrow left"></Icon>}
          ></Button> */}
          <Icon
            color="teal"
            size="large"
            name="arrow left"
            inverted
            link
            onClick={doneClickHandler}
          ></Icon>
        </p>
        <Grid.Row>
          <Button
            basic
            color="teal"
            circular
            size="big"
            disabled={samples.length < 1}
            onClick={runTestHandler}
          >
            Start Test
          </Button>
        </Grid.Row>
      </Grid>
    </Segment>
  );

  const RunTestPage = (
    <Grid centered>
      <Grid.Row>
        <Header as="h2" inverted>
          Running Test in {props.instrument.instrumentid}
        </Header>
      </Grid.Row>
      <Grid.Row>
        <RecommendedProperties context="Samples stored at" />
      </Grid.Row>
      <Grid.Row>
        <List horizontal size="huge">
          {renderSamples}
        </List>
      </Grid.Row>
      <Grid.Row>
        <Label size="big" style={{ backgroundColor: "#0F2B43" }}>
          <Timer minutes={recommendedProp.time / 60} timestamp={timestamp} />
        </Label>
      </Grid.Row>
      <Grid.Row>
        <Button
          basic
          color="teal"
          circular
          size="big"
          onClick={goBackToHomePage}
        >
          Run another test
        </Button>
      </Grid.Row>
    </Grid>
  );

  return loading ? (
    <Loading message="Updating..." />
  ) : doneScanning ? (
    runTest ? (
      RunTestPage
    ) : (
      ReviewPage
    )
  ) : (
    InstrumnetPage
  );
}

export default Instrument;
