import React from "react";
import { Segment } from "semantic-ui-react";

function Error() {
  return (
    <Segment padded>
      <p style={{ color: "grey" }}> This route is not valid</p>
    </Segment>
  );
}

export default Error;
