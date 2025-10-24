import { useState, useEffect } from "react";

const DigitalClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
  };

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  return (
    <div style={{ textAlign: "center", fontFamily: "monospace" }}>
      <p style={{ fontSize: "1.5em" }}>{currentTime.toLocaleDateString()}</p>
      <div style={{ fontSize: "2em" }}>
        <span>{formatTime(hours)}</span>:<span>{formatTime(minutes)}</span>:
        <span>{formatTime(seconds)}</span>
      </div>
    </div>
  );
};

export default DigitalClock;
