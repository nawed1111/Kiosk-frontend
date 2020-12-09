import React, { useState, useEffect } from "react";
import { Header, Icon } from "semantic-ui-react";

function Timer(props) {
  const calculateTimeLeft = () => {
    let date = new Date(props.timestamp + props.minutes * 60 * 1000);

    const difference = +date - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hrs: Math.floor((difference / (1000 * 60 * 60)) % 24),
        mins: Math.floor((difference / 1000 / 60) % 60),
        secs: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval, index) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={`${interval}${index}`}>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <Header as="h3" style={{color: "#FFC300"}}>
      {timerComponents.length ? (
        <div>
          <Icon name="hourglass half" /> {timerComponents}
        </div>
      ) : (
        <span>Test Completed</span>
      )}
    </Header>
  );
}

export default Timer;
