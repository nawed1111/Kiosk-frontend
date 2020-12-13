import React from "react";

import { Message } from "semantic-ui-react";

function Alert(props) {
  return (
    <Message compact hidden={props.hideError} color="red">
      {props.content}
    </Message>
  );
}

export default Alert;
