import React from "react";
import styled from "styled-components";
import { XAxis, XAxisValue } from "./XAxis";

const hoursBy10Minutes = (hours: number): string[] =>
  [...new Array(hours)].flatMap((v, h) =>
    ["00", "10", "20", "30", "40", "50"].map((m) => `${h}:${m}`)
  );

const TimeAxis = ({ width }: { width: number }) => (
  <XAxis width={width}>
    {hoursBy10Minutes(6).map((time) => (
      <TimeAxisValue key={time}>{time}</TimeAxisValue>
    ))}
  </XAxis>
);

const TimeAxisValue = styled(XAxisValue)`
  width: 200px;
`;

export default TimeAxis;
