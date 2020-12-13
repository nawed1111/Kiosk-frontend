import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "../../../util/axios";

import { getSocket } from "../../../util/socket";

import Scan from "../../../components/Scan/Scan";
import Timer from "../../../components/Timer/Timer";
import Loading from "../../../components/Loader/Loading";
import Alert from "../../../components/Alert/Alert";

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
  Confirm,
} from "semantic-ui-react";

import sampleImage from "../../../assets/images/sample.png";
import orImage from "../../../assets/images/OR.png";

const style = {
  list: {
    cursor: "pointer",
  },
  listHeader: {
    color: "grey",
    fontSize: "18px",
  },
  listContent: {
    color: "grey",
    fontSize: "12px",
  },
};

function Instrument(props) {
  const _KIOSK_ID = localStorage.getItem("kioskId");
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
  const [rerender, setrerender] = useState(false);
  const [alert, setalert] = useState({
    hide: true,
    content: "",
  });
  const [open, setopen] = useState({
    status: false,
    sampleid: "",
  });

  const doneClickHandler = () => {
    setalert({ hide: true, content: "" });
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
      console.log(error);
      setloading(false);
      if (error.response)
        return window.alert(error.response.data.error.message);
      window.alert("Possible error- Server not connected! Contact admin");
    }
  };

  const removeASampleHandler = useCallback(
    (sampleid) => {
      const index = samples.findIndex((sample) => sample.sampleid === sampleid);
      samples.splice(index, 1);
      setrerender(!rerender);
      if (samples.length === 0) setDoneScanning(false);
    },
    [samples, rerender]
  );

  const runTestHandler = async () => {
    const timestampOfExecution = new Date().getTime();
    setTimestamp(timestampOfExecution);

    setloading(true);

    try {
      await axios.post(
        "/api/test/run-test",
        {
          instrumentId: props.instrument.instrumentid,
          samples,
          duration: recommendedProp.time / 60,
          timestamp: timestampOfExecution,
          kioskId: _KIOSK_ID,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setloading(false);
      setRunTest(true);
    } catch (err) {
      console.log(err);
      setloading(false);
      if (err.response) return window.alert(err.response.data.error.message);
      window.alert("Possible error- Server not connected! Contact admin");
    }
  };

  const goBackToHomePage = () => {
    props.updateInstrumentStatus();
    props.deSelect();
  };

  useEffect(() => {
    const socket = getSocket();

    if (!doneScanning) {
      socket.on("scannedSample", (data) => {
        let flag = false;
        setalert({ hide: true });
        setloading(false);
        samples.forEach((sample) => {
          if (sample.sampleid === data.sampleid) {
            flag = true;
            // return window.alert(`Sample ${data.sampleid} is already scanned.`);
            return setalert({
              hide: false,
              content: `Sample ${data.sampleid} is already scanned.`,
            });
          } else if (
            sample.recomtemp !== data.recomtemp ||
            sample.recomtempunits !== data.recomtempunits ||
            sample.recomduration !== data.recomduration ||
            sample.recomdurationunits !== data.recomdurationunits
          ) {
            flag = true;
            // return window.alert(
            //   `Please scan samples which is to be stored at ${
            //     recommendedProp.temp
            //   }${recommendedProp.tempUnit}
            //   for ${recommendedProp.time / 60} mins only.`
            // );
            return setalert({
              hide: false,
              content: `Please scan samples which is to be stored at ${
                recommendedProp.temp
              }${recommendedProp.tempUnit} 
                for ${recommendedProp.time / 60} mins only.`,
            });
          }
        });
        if (!flag) setSamples(samples.concat(data));
      });
    }

    return () => {
      _isMounted.current = false;
      socket.off("scannedSample");
    };
  }, [samples, doneScanning, recommendedProp]);

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
  }, [samples, rerender]);

  const renderSamples = samples.map((sample, index) => (
    <List.Item key={`${sample.sampleid}${index}`}>
      <Image size="mini" src={sampleImage} alt="sample" />
      <List.Content>
        <List.Header style={{ color: "white" }}>{sample.sampleid}</List.Header>
      </List.Content>
    </List.Item>
  ));

  const renderSamplesInReviewPage = samples.map((sample, index) => (
    <List.Item
      key={`${sample.sampleid}${index}`}
      onClick={() => setopen({ status: true, sampleid: sample.sampleid })}
    >
      <Segment stacked textAlign="left">
        <Button
          basic
          circular
          color="teal"
          size="mini"
          floated="right"
          icon={<Icon name="delete" color="teal" />}
        />
        <List.Content>
          <List.Header style={style.listHeader}>
            <Image size="mini" src={sampleImage} />
            {sample.sampleid.toUpperCase()}
          </List.Header>
          <List.Description style={style.listContent}>
            STATUS: {sample.samplestatus.toUpperCase()}
          </List.Description>
        </List.Content>
      </Segment>
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
                  onChange={() => setalert({ hide: true })}
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
            <Alert hideError={alert.hide} content={alert.content} />
            {samples.length > 0 ? (
              <Container textAlign="center" style={{ marginTop: "2em" }}>
                <RecommendedProperties context="Samples to be stored at" />
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

  const ReviewPage = (
    <Segment basic padded>
      <Grid centered padded>
        <Grid.Row>
          <RecommendedProperties context="Samples to be stored at" />
        </Grid.Row>
        <Grid.Row>
          <List horizontal style={style.list}>
            {renderSamplesInReviewPage}
          </List>
        </Grid.Row>
        <Confirm
          open={open.status}
          content={`Please confirm if you want to remove sample ${open.sampleid}`}
          cancelButton="Cancel"
          confirmButton="Yes"
          onCancel={() => setopen({ status: false, sampleid: "" })}
          size="mini"
          onConfirm={() => {
            removeASampleHandler(open.sampleid);
            setopen({ status: false, sampleid: "" });
          }}
        />
        <p>
          Want to add more samples?{"    "}
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
