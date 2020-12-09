import React from "react";
import Timer from "../../../components/Timer/Timer";
import { Card } from "semantic-ui-react";

const style = {
  cardBody: {
    color: "#FFFFFF",
  },
};

export default function RunningTests(props) {
  const test = props.test;

  return (
    <Card
      centered
      style={{ marginBottom: "1em", backgroundColor: "#536C78" }}
      onClick={props.openLoadedInstrumentHandler.bind(this, test.instrumentId)}
    >
      <Card.Content>
        <Card.Header style={style.cardBody}>{test.instrumentId}</Card.Header>
        {/* <Card.Meta>{test.doneOn.split("GMT")[0]}</Card.Meta> */}
        <Card.Description style={style.cardBody}>
          Number of samples: {test.samples.length}
          <Timer minutes={test.duration} timestamp={test.timestamp} />
        </Card.Description>
      </Card.Content>
    </Card>
  );
}
