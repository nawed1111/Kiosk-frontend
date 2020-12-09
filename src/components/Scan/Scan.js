import React from "react";
import { Grid, Segment, Image, Header } from "semantic-ui-react";

import scanImage from "../../assets/images/scanner1.png";

function Scan(props) {
  return (
    <Grid>
      <Grid.Column>
        <Segment basic>
          <Image src={scanImage} size="large" centered />
        </Segment>
        <Segment basic>
          <Header size="large" inverted>
            SCAN {props.name}
          </Header>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}

export default Scan;
