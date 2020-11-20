import React, { useState, useEffect } from "react";

function Timer(props) {
  const calculateTimeLeft = () => {
    let date = new Date(props.timestamp + props.minutes * 60 * 1000);

    const difference = +date - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
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
  // const TimeUp = () => {
  //   return alert("Time's up! Remove sample/s");
  // };

  return (
    <div>
      {timerComponents.length ? timerComponents : <span>Time's Up </span>}
    </div>
  );
}

export default Timer;
