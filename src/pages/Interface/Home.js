import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../context/auth-context";

import axios from "../../util/axios";

import InstrumentPage from "./Instrument/Instrument";
import RemoveSamplesFromInstrumentPage from "./Instrument/RemoveSamplesFromInstrument";
import RunningTests from "./Instrument/RunningTests";
import Loading from "../../components/Loader/Loading";

import { Grid, Button, Header, Card, Icon, Image } from "semantic-ui-react";

import logo from "../../assets/images/logo.png";

const style = {
  cardBody: {
    color: "#FFFFFF",
  },
  status: {
    color: "#FFC300",
  },
};

function Home() {
  const _KIOSK_ID = localStorage.getItem("kioskId");
  const auth = useContext(AuthContext);

  const [rerender, setrerender] = useState(false);
  const [instrument, setInstrument] = useState(null);
  const [loading, setloading] = useState(false);

  const [instrumentsofKiosk, setInstrumentsOfKiosk] = useState({
    instruments: [],
    runningTests: [],
  });

  const [openInstrument, setopenInstrument] = useState({
    loaded: false,
    empty: false,
    instrumentId: null,
  });

  const openLoadedInstrumentHandler = (instrumentId) => {
    setopenInstrument({
      loaded: !openInstrument.loaded,
      empty: false,
      instrumentId,
    });
    setInstrument(null);
  };
  const onInstrumentClickHandler = (data) => {
    setInstrument(data);
    setopenInstrument({ ...openInstrument, empty: true });
  };

  const logoutHandler = async () => {
    setloading(true);
    try {
      await axios.delete(
        `/api/auth/logout`,
        {
          data: {
            refreshToken: JSON.parse(localStorage.getItem("token"))
              .refreshToken,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setloading(false);
      auth.logout();
      window.location.reload();
    } catch (error) {
      console.log(error);
      setloading(false);
      auth.logout();
      window.location.reload();
    }
  };

  const gobackToHomePage = () => {
    setopenInstrument({ ...openInstrument, empty: false });
    setInstrument(null);
  };

  useEffect(() => {
    async function helper() {
      setloading(true);
      try {
        const response = await axios.get(`/api/instruments/${_KIOSK_ID}`);
        setloading(false);

        setInstrumentsOfKiosk({
          instruments: response.data.instruments,
          runningTests: response.data.testsRunning,
        });
      } catch (err) {
        setloading(false);

        console.log(err);
        if (!err.response)
          window.alert("Possible error- Server not connected! Contact admin");
      }
    }
    helper();
  }, [_KIOSK_ID, rerender]);

  const renderInstruments = instrumentsofKiosk.instruments.map(
    (instrument, index) => (
      <Grid.Column
        key={`${instrument.instrumentid}${index}`}
        textAlign="center"
      >
        <Card
          centered
          onClick={
            instrument.status === "available"
              ? onInstrumentClickHandler.bind(this, instrument)
              : undefined
          }
          style={{
            backgroundColor:
              instrument.status === "inuse" ? "#430F32" : "#006A4E",
            marginBottom: "1em",
          }}
        >
          <Card.Content>
            <Card.Header style={style.cardBody}>
              {instrument.instrumentid}
            </Card.Header>
            <Card.Description style={style.cardBody}>
              {instrument.name}
            </Card.Description>
            <Card.Meta style={style.status}>{instrument.status}</Card.Meta>
          </Card.Content>
        </Card>
      </Grid.Column>
    )
  );

  const testsRunning = instrumentsofKiosk.runningTests.map((test, index) => (
    <Grid.Column key={`${test._id}${index}`} textAlign="center">
      <RunningTests
        test={test}
        openLoadedInstrumentHandler={openLoadedInstrumentHandler}
      />
    </Grid.Column>
  ));

  const HomePage = (
    <Grid>
      <Grid.Row centered>
        <Header as="h2" inverted>
          CONNECTED INSTRUMENTS:
        </Header>
      </Grid.Row>
      <Grid.Row centered columns={3}>
        {renderInstruments}
      </Grid.Row>

      <Grid.Row centered>
        <Header as="h2" inverted>
          TEST RUNNING IN: {instrumentsofKiosk.runningTests.length} INSTRUMENTS
        </Header>
      </Grid.Row>
      <Grid.Row centered columns={3}>
        {testsRunning}
      </Grid.Row>
    </Grid>
  );

  return (
    <>
      {loading ? (
        <Loading message="Fetching Data..." />
      ) : (
        <>
          <Grid>
            <Grid.Row columns="2">
              <Grid.Column textAlign="left">
                <Header
                  inverted
                  style={{ fontFamily: "Roboto", fontSize: "35px" }}
                >
                  {_KIOSK_ID.toUpperCase()}
                </Header>
              </Grid.Column>
              <Grid.Column textAlign="right">
                <Button
                  basic
                  color="blue"
                  size="huge"
                  circular
                  onClick={logoutHandler}
                >
                  Logout
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {openInstrument.empty ? (
            <InstrumentPage
              instrument={instrument}
              deSelect={gobackToHomePage}
              updateInstrumentStatus={() => setrerender(!rerender)}
            />
          ) : openInstrument.loaded ? (
            <RemoveSamplesFromInstrumentPage
              loadedInstrumentInfo={{
                test: instrumentsofKiosk.runningTests.find(
                  (test) => test.instrumentId === openInstrument.instrumentId
                ),
              }}
              stayAtLoadedInstrumentPage={() =>
                setopenInstrument({
                  ...openInstrument,
                  loaded: false,
                  empty: false,
                })
              }
              updateHomePage={openLoadedInstrumentHandler}
              updateInstrumentStatus={() => setrerender(!rerender)}
            />
          ) : (
            HomePage
          )}
          <Grid>
            <Grid.Row columns="2">
              <Grid.Column textAlign="left">
                <Button
                  circular
                  basic
                  color="blue"
                  size="huge"
                  icon={<Icon size="large" name="long arrow alternate left" />}
                  onClick={gobackToHomePage}
                />
              </Grid.Column>
              <Grid.Column textAlign="right" verticalAlign="bottom">
                <Image src={logo} avatar alt="Logo" size="mini" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </>
      )}
    </>
  );
}

export default Home;
