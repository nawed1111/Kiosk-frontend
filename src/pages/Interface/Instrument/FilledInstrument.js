import React from "react";
import Timer from "../../../components/Timer/Timer";
import { Header, List, Image, Grid } from "semantic-ui-react";
import sampleImage from "../../../assets/images/sample.png";

function FilledInstrument(props) {
  const loadedInstrumentInfo = props.loadedInstrumentInfo;
  const { test } = loadedInstrumentInfo;

  const renderSamples = test.samples.map((sample, index) => (
    <List.Item key={`${sample.sampleid}${index}`}>
      <Image size="mini" src={sampleImage} alt="sample"></Image>
      <List.Content>
        <List.Header style={{ color: "white" }}>{sample.sampleid}</List.Header>
      </List.Content>
    </List.Item>
  ));
  return (
    <Grid centered>
      <Grid.Row>
        <Header as="h3" inverted>
          INSTRUMENT: {test.instrumentId}
        </Header>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column textAlign="center">
          <Grid>
            <Grid.Row centered>
              {/* <Header as="h3" inverted>
                SAMPLES:
              </Header> */}
              <List horizontal size="huge">
                {renderSamples}
              </List>
            </Grid.Row>
            {/* <Grid.Row centered></Grid.Row> */}
          </Grid>
          <p>Test duration: {test.duration} mins</p>
          <p>Test Started: {test.doneOn.split("GMT")[0]}</p>
          <p>Test done by: {test.doneBy}</p>
          <Timer minutes={test.duration} timestamp={test.timestamp} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default FilledInstrument;
