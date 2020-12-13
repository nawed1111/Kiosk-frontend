import React, { useState } from "react";

import Alert from "../Alert/Alert";

import { Grid, Table, Icon, Input, Button, Header } from "semantic-ui-react";

function Numpad(props) {
  const [pin, setpin] = useState("");
  const [inputTypePassword, setinputTypePassword] = useState(true);

  const pinSubmitHandler = () => {
    props.onpinSubmit(pin);
    setpin("");
  };

  const backButtonClickHandler = () => {
    if (pin.length > 0) {
      setpin(pin.slice(0, -1));
    } else {
      props.cancel();
    }
  };

  const pinChnageHandler = (event) => {
    props.sethideError();
    if (pin.length === 4) {
      return pinSubmitHandler();
    }
    setpin(pin.concat(event.target.value));
  };

  const NumpadValue = ({ value }) => {
    return (
      <Button
        value={value}
        basic
        color="blue"
        inverted
        size="huge"
        onClick={(event) => pinChnageHandler(event)}
      >
        {value}
      </Button>
    );
  };

  const RenderBodyRow = (props) => (
    <>
      <Table.Row>
        {props.values.map((value, index) => (
          <Table.Cell key={`${value}${index}`}>
            <NumpadValue value={value} />
          </Table.Cell>
        ))}
      </Table.Row>
    </>
  );

  return (
    <Grid centered>
      <Grid.Row textAlign="center">
        <Grid.Column textAlign="center">
          <Header as="h2" inverted>
            <Icon name="lock" size="massive" inverted />
            {props.heading}
          </Header>
          <Alert hideError={props.hideError} content={props.content} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row textAlign="center">
        <Grid.Column width="7">
          <Table
            textAlign="center"
            style={{ backgroundColor: "#0F2B43" }}
            basic
            // compact
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="3">
                  <Input
                    focus
                    value={pin}
                    size="big"
                    type={inputTypePassword ? "password" : "text"}
                    icon={
                      <Icon
                        name={inputTypePassword ? "eye slash" : "eye"}
                        link
                        size="large"
                        onClick={() => setinputTypePassword(!inputTypePassword)}
                      />
                    }
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <RenderBodyRow values={[1, 2, 3]} />
              <RenderBodyRow values={[4, 5, 6]} />
              <RenderBodyRow values={[7, 8, 9]} />
              <Table.Row>
                <Table.Cell>
                  <Button
                    basic
                    color="blue"
                    size="huge"
                    inverted
                    icon={
                      <Icon
                        name={
                          pin.length > 0
                            ? "delete"
                            : "long arrow alternate left"
                        }
                        size="large"
                      />
                    }
                    onClick={backButtonClickHandler}
                  />
                </Table.Cell>
                <Table.Cell>
                  <NumpadValue value="0" />
                </Table.Cell>
                <Table.Cell>
                  <Button
                    basic
                    color="blue"
                    size="huge"
                    inverted
                    icon={<Icon size="large" name="check" />}
                    disabled={pin.length < 1}
                    onClick={pinSubmitHandler}
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default Numpad;
