import React from "react";
import styled from "styled-components";
import { XAxis, XAxisValue } from "./XAxis";

const DistanceAxis = ({ width }: { width: number }) => (
  <XAxis width={width}>
    {[...new Array(44)].map((e, i) => (
      <DistanceAxisValue key={i}>{i}K</DistanceAxisValue>
    ))}
  </XAxis>
);

const DistanceAxisValue = styled(XAxisValue)`
  width: 100px;
`;

export default DistanceAxis;
